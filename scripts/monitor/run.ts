/**
 * Source monitor — entry point.
 *
 *   npx tsx scripts/monitor/run.ts
 *
 * Checks the Village sources, writes proposed updates into data/*.json, adds a
 * change-log entry per source that changed, and writes .monitor/summary.md.
 * In GitHub Actions, content changes become a pull request; merging it is the human
 * review step that publishes them (see .github/workflows/source-monitor.yml).
 *
 * Every source that is read successfully also gets its "last checked" date (and
 * confirmed records their "last verified" date) stamped, even when nothing changed,
 * so the site never looks stale. A run with only date stamps reports 0 changes and
 * the workflow publishes it directly.
 *
 * A source that fails to load or parse is reported and skipped. Its data is left
 * untouched, and the run exits non-zero so the failure is visible.
 */
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs'
import path from 'node:path'
import type { ChangeLogEntry, ChangeType, Source } from '../../types'
import { readJson, writeJson, today, ROOT, type Finding } from './lib'
import * as legal from './legal-notices'
import * as staff from './staff-directory'
import * as board from './village-board'

const MONITORS: {
  name: string
  sourceId: string
  sourceUrl: string
  changeType: ChangeType
  run: () => Promise<Finding[]>
}[] = [
  { name: 'Legal Notices & Postings', sourceId: legal.SOURCE_ID, sourceUrl: legal.SOURCE_URL, changeType: 'document_indexed', run: legal.run },
  { name: 'Staff Directory', sourceId: staff.SOURCE_ID, sourceUrl: staff.SOURCE_URL, changeType: 'status_updated', run: staff.run },
  { name: 'Boards & Commissions', sourceId: board.SOURCE_ID, sourceUrl: board.SOURCE_URL, changeType: 'roster_verified', run: board.run },
]

const LABEL: Record<Finding['kind'], string> = {
  added: 'New',
  updated: 'Changed',
  removed: 'Removed',
  needs_review: 'Check by hand',
}

async function main() {
  const date = today()
  const results: { name: string; sourceUrl: string; findings: Finding[]; error?: string }[] = []

  for (const m of MONITORS) {
    try {
      const findings = await m.run()
      results.push({ name: m.name, sourceUrl: m.sourceUrl, findings })
      console.log(`[monitor] ${m.name}: ${findings.length} change(s)`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ name: m.name, sourceUrl: m.sourceUrl, findings: [], error: msg })
      console.error(`[monitor] ${m.name}: ERROR ${msg}`)
    }
  }

  // Change log: one published entry per source with data changes.
  const log = readJson<ChangeLogEntry[]>('change-log.json')
  let nextNum = Math.max(0, ...log.map((e) => Number(e.id.replace(/\D/g, '')) || 0)) + 1
  const newEntries: ChangeLogEntry[] = []
  const sources = readJson<Source[]>('sources.json')

  for (const m of MONITORS) {
    const r = results.find((x) => x.name === m.name)!
    // A source that was read and parsed counts as checked, whether or not it changed.
    const src = sources.find((s) => s.id === m.sourceId)
    if (src && !r.error) src.lastChecked = date
    const dataChanges = r.findings.filter((f) => f.kind !== 'needs_review')
    if (!dataChanges.length) continue
    const counts = (['added', 'updated', 'removed'] as const)
      .map((k) => [k, dataChanges.filter((f) => f.kind === k).length] as const)
      .filter(([, n]) => n > 0)
      .map(([k, n]) => `${n} ${k}`)
      .join(', ')
    const items = dataChanges.slice(0, 12).map((f) => f.summary)
    const more = dataChanges.length > 12 ? ` …and ${dataChanges.length - 12} more.` : ''
    newEntries.push({
      id: `chg-${String(nextNum++).padStart(3, '0')}`,
      changeTitle: `${m.name}: ${counts}`,
      sourceId: m.sourceId,
      changeType: m.changeType,
      dateDetected: date,
      publicStatus: 'published',
      reviewStatus: 'auto_detected',
      summary: `Detected by the automated source check and approved for publication. ${items.map((i) => i.replace(/\.$/, '')).join('; ')}.${more}`,
      linkToSource: m.sourceUrl,
    })
  }

  if (newEntries.length) writeJson('change-log.json', [...newEntries.reverse(), ...log])
  writeJson('sources.json', sources)

  // Pull-request summary.
  const lines: string[] = [`## Source check, ${date}`, '']
  for (const r of results) {
    lines.push(`### ${r.name}`)
    if (r.error) lines.push(`**Could not check this source:** ${r.error}`)
    else if (!r.findings.length) lines.push('No changes.')
    else for (const f of r.findings) lines.push(`- **${LABEL[f.kind]}:** ${f.summary}`)
    lines.push(`Source: ${r.sourceUrl}`, '')
  }
  lines.push(
    '---',
    'Merging this pull request publishes these updates to villageofgreenville.com.',
    'New documents are labeled **auto-detected**; adoption status is never inferred. Edit the data files on this branch before merging if anything needs correcting, or close the PR to reject it.',
  )
  const outDir = path.join(ROOT, '.monitor')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(path.join(outDir, 'summary.md'), lines.join('\n') + '\n')

  const total = results.reduce((n, r) => n + r.findings.length, 0)
  const failed = results.filter((r) => r.error).length
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `changes=${total}\nfailed=${failed}\n`)
  }
  console.log(`[monitor] Done: ${total} change(s), ${failed} source(s) failed.`)
  if (failed) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
