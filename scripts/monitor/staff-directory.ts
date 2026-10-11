/**
 * Staff Directory → data/staff-directory.json
 *
 * Privacy: only name, position and department are kept. Emails and phone numbers on
 * the official page are never stored or republished.
 */
import * as cheerio from 'cheerio'
import type { StaffMember } from '../../types'
import { clean, fetchHtml, norm, readJson, similarity, slugify, today, writeJson, type Finding } from './lib'

export const SOURCE_ID = 'greenville-staff'
export const SOURCE_URL = 'https://www.townofgreenville.com/government/staff_directory.php'

const DEPARTMENTS: Record<string, string> = {
  administration: 'Administration',
  administrative: 'Administration',
  'community & economic development': 'Planning',
  'building inspections': 'Building Inspection',
  'water & sewer utility': 'Utilities',
  'public works, stormwater and utilities': 'Public Works',
  'public works': 'Public Works',
  'parks, recreation & forestry': 'Parks & Recreation',
  'fire & ems': 'Fire & EMS',
}

export interface PostedStaff {
  name: string
  title: string
  department: string
}

export function parse(html: string): PostedStaff[] {
  const $ = cheerio.load(html)
  const table = $('table')
    .filter((_, t) => /first name/i.test($(t).find('th').text()))
    .first()
  const out: PostedStaff[] = []
  table.find('tbody tr').each((_, tr) => {
    const cells = $(tr)
      .children('td')
      .map((_, td) => clean($(td).text()))
      .get()
    if (cells.length < 4) return
    const [dept, first, last, title] = cells // cells[4] email and cells[5] phone are ignored
    const name = clean(`${first} ${last}`)
    if (!name) return
    out.push({ name, title, department: DEPARTMENTS[dept.toLowerCase()] ?? dept })
  })
  return out
}

/** True when two titles differ by more than formatting or a typo. */
function titleChanged(a: string, b: string): boolean {
  return similarity(norm(a), norm(b)) < 0.9
}

export async function run(): Promise<Finding[]> {
  const posted = parse(await fetchHtml(SOURCE_URL, 'staff_directory.html'))
  const staff = readJson<StaffMember[]>('staff-directory.json')
  if (posted.length < Math.max(3, staff.length / 2)) {
    throw new Error(
      `[staff-directory] Parsed only ${posted.length} staff rows (site has ${staff.length}). The page layout may have changed; nothing was written.`,
    )
  }

  const date = today()
  const findings: Finding[] = []
  const postedByName = new Map(posted.map((p) => [norm(p.name), p]))
  const next: StaffMember[] = []

  for (const s of staff) {
    const p = postedByName.get(norm(s.name))
    if (!p) {
      findings.push({
        sourceId: SOURCE_ID,
        sourceUrl: SOURCE_URL,
        kind: 'removed',
        summary: `${s.name} (${s.title}) is no longer listed in the Staff Directory.`,
      })
      continue
    }
    if (titleChanged(s.title, p.title)) {
      findings.push({
        sourceId: SOURCE_ID,
        sourceUrl: SOURCE_URL,
        kind: 'updated',
        summary: `${s.name}: “${s.title}” → “${p.title}”.`,
      })
      next.push({ ...s, title: p.title, lastVerified: date })
    } else {
      next.push(s)
    }
  }

  for (const p of posted) {
    if (staff.some((s) => norm(s.name) === norm(p.name))) continue
    findings.push({
      sourceId: SOURCE_ID,
      sourceUrl: SOURCE_URL,
      kind: 'added',
      summary: `${p.name}, ${p.title} (${p.department}).`,
    })
    next.push({
      id: slugify(p.name),
      name: p.name,
      title: p.title,
      department: p.department,
      email: null,
      sourceId: SOURCE_ID,
      lastVerified: date,
    })
  }

  if (findings.length) writeJson('staff-directory.json', next)
  return findings
}
