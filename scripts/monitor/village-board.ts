/**
 * Boards & Commissions → data/civic-roster.json (Village Board) and a change flag for
 * commission membership.
 *
 * Privacy: the official page lists home addresses and personal phone numbers for
 * Board members. Only office, name and the "Elected" note are read; the other
 * columns are never parsed or stored.
 *
 * Commission memberships are free text, so they are not parsed. A fingerprint of that
 * text is kept in data/monitor-state.json and any change is flagged for manual review.
 */
import * as cheerio from 'cheerio'
import type { CivicMember } from '../../types'
import { clean, fetchHtml, norm, readJson, sha, slugify, today, writeJson, type Finding } from './lib'

export const SOURCE_ID = 'greenville-boards'
export const SOURCE_URL =
  'https://www.townofgreenville.com/government/boards_and_commissions.php'

export interface PostedMember {
  name: string
  office: string
  termNote: string
  electedYear: number | null
}

export function parse(html: string): { board: PostedMember[]; commissionsText: string } {
  const $ = cheerio.load(html)
  const board: PostedMember[] = []
  $('table')
    .first()
    .find('tr')
    .each((_, tr) => {
      const cells = $(tr)
        .children('td')
        .map((_, td) => clean($(td).text()))
        .get()
      if (cells.length < 2) return
      const m = cells[0].match(/^(President|Trustee)\s+(.+)$/i)
      if (!m) return
      const elected = cells.find((c) => /^elected/i.test(c)) ?? ''
      const year = elected.match(/(\d{4})/)
      board.push({
        name: clean(m[2]),
        office: /president/i.test(m[1]) ? 'Village President' : 'Trustee',
        termNote: clean(elected.replace(',', '')),
        electedYear: year ? Number(year[1]) : null,
      })
    })

  const root = $('#entry').length ? $('#entry') : $('main')
  root.find('table').remove()
  const commissionsText = clean(root.text())
    .replace(/^.*?(PLANNING COMMISSION)/i, '$1')
    .toLowerCase()
  return { board, commissionsText }
}

interface MonitorState {
  fingerprints: Record<string, string>
}

export async function run(): Promise<Finding[]> {
  const { board, commissionsText } = parse(await fetchHtml(SOURCE_URL, 'boards_and_commissions.html'))
  if (board.length < 3) {
    throw new Error(
      `[village-board] Parsed only ${board.length} Board members from ${SOURCE_URL}. The page layout may have changed; nothing was written.`,
    )
  }

  const date = today()
  const findings: Finding[] = []
  const roster = readJson<CivicMember[]>('civic-roster.json')
  const postedByName = new Map(board.map((b) => [norm(b.name), b]))
  const next: CivicMember[] = []

  for (const r of roster) {
    const p = postedByName.get(norm(r.name))
    if (!p) {
      findings.push({
        sourceId: SOURCE_ID,
        sourceUrl: SOURCE_URL,
        kind: 'removed',
        summary: `${r.name} (${r.office}) is no longer listed on the Village Board.`,
      })
      continue
    }
    const changed = p.office !== r.office || norm(p.termNote) !== norm(r.termNote)
    if (changed) {
      findings.push({
        sourceId: SOURCE_ID,
        sourceUrl: SOURCE_URL,
        kind: 'updated',
        summary: `${r.name}: ${r.office}, ${r.termNote} → ${p.office}, ${p.termNote}.`,
      })
      next.push({
        ...r,
        office: p.office,
        termNote: p.termNote,
        electedYear: p.electedYear ?? r.electedYear,
        lastVerified: date,
      })
    } else {
      // Still listed and unchanged: confirmed against the official page today.
      next.push({ ...r, lastVerified: date })
    }
  }

  for (const p of board) {
    if (roster.some((r) => norm(r.name) === norm(p.name))) continue
    findings.push({
      sourceId: SOURCE_ID,
      sourceUrl: SOURCE_URL,
      kind: 'added',
      summary: `${p.name}, ${p.office} (${p.termNote}). Listed as “needs review” until confirmed.`,
    })
    next.push({
      id: slugify(p.name),
      name: p.name,
      office: p.office,
      status: 'needs_review',
      termNote: p.termNote,
      electedYear: p.electedYear ?? new Date().getFullYear(),
      email: null,
      sourceId: SOURCE_ID,
      lastVerified: date,
    })
  }

  // Keep the President first, then trustees in the order the Village lists them.
  const order = board.map((b) => norm(b.name))
  next.sort((a, b) => order.indexOf(norm(a.name)) - order.indexOf(norm(b.name)))
  writeJson('civic-roster.json', next)

  // Commission membership: fingerprint only, flag for manual review.
  const state: MonitorState = (() => {
    try {
      return readJson<MonitorState>('monitor-state.json')
    } catch {
      return { fingerprints: {} }
    }
  })()
  const key = 'greenville-boards:commissions'
  const fp = sha(commissionsText)
  if (state.fingerprints[key] && state.fingerprints[key] !== fp) {
    findings.push({
      sourceId: SOURCE_ID,
      sourceUrl: SOURCE_URL,
      kind: 'needs_review',
      summary:
        'Commission membership text (Planning Commission, Board of Appeals, Park & Rec, Fire Commission, Land Stewardship) changed. Compare the official page by hand.',
    })
  }
  if (state.fingerprints[key] !== fp) {
    state.fingerprints[key] = fp
    writeJson('monitor-state.json', state)
  }

  return findings
}
