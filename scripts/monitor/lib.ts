/**
 * Shared helpers for the daily source monitor.
 *
 * Fetching: live pages are fetched over HTTPS. Set MONITOR_FIXTURES=<dir> to read
 * saved HTML from that directory instead (used by `npm run monitor:test`).
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'

export const ROOT = path.resolve(__dirname, '..', '..')
export const DATA = path.join(ROOT, 'data')

const USER_AGENT =
  'VillageOfGreenville.com source monitor (independent community record; +https://villageofgreenville.com)'

export function today(): string {
  // Date in America/Chicago so a run at 6am local is stamped with the local date.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date())
}

export async function fetchHtml(url: string, fixtureName: string): Promise<string> {
  const fixtures = process.env.MONITOR_FIXTURES
  if (fixtures) return readFileSync(path.join(fixtures, fixtureName), 'utf8')

  let lastError: unknown
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
      return await res.text()
    } catch (err) {
      lastError = err
      await new Promise((r) => setTimeout(r, attempt * 5000))
    }
  }
  throw new Error(`Failed to fetch ${url}: ${String(lastError)}`)
}

export function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(DATA, file), 'utf8')) as T
}

export function writeJson(file: string, value: unknown): void {
  writeFileSync(path.join(DATA, file), JSON.stringify(value, null, 2) + '\n')
}

export function readJsonIfExists<T>(file: string, fallback: T): T {
  return existsSync(path.join(DATA, file)) ? readJson<T>(file) : fallback
}

export function sha(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 16)
}

export function clean(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

export function slugify(text: string, max = 60): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '')
}

/** Normalize a title for comparison: letters and digits only. */
export function norm(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Levenshtein similarity in [0, 1], used to ignore typo-level differences. */
export function similarity(a: string, b: string): number {
  if (a === b) return 1
  const m = a.length
  const n = b.length
  if (!m || !n) return 0
  const prev = new Array(n + 1).fill(0).map((_, j) => j)
  for (let i = 1; i <= m; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return 1 - prev[n] / Math.max(m, n)
}

/** A detected change, used for the change log and the pull-request summary. */
export interface Finding {
  sourceId: string
  sourceUrl: string
  kind: 'added' | 'updated' | 'removed' | 'needs_review'
  summary: string
}
