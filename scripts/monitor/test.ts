/**
 * Parser checks against saved copies of the Village pages.
 *
 *   npm run monitor:test
 *
 * Run this after changing a parser. If a check fails in CI after the Village
 * redesigns a page, refresh the fixture from the live page and fix the parser.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import * as legal from './legal-notices'
import * as staff from './staff-directory'
import * as board from './village-board'

const fx = (name: string) => readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')

// Legal notices
const docs = legal.parse(fx('legal_notices_and_postings.html'))
assert.equal(docs.length, 15, 'legal: document count')
const r37 = docs.find((d) => d.title.startsWith('Resolution No. 37-26'))!
assert.equal(r37.date, '2026-09-29')
assert.equal(r37.section, 'Resolutions')
assert.ok(!r37.url.includes('?t='), 'legal: cache-buster stripped')
assert.ok(!r37.url.includes(' '), 'legal: spaces encoded')
assert.equal(docs.find((d) => d.title.startsWith('NOTICE'))!.section, 'Legal Notices & Postings')
assert.equal(legal.docId('Resolution No. 37-26 JRB TID #3 Approval', null), 'res-37-26')
assert.equal(legal.docId('Resoltuion No. 9-26 - Approving…', null), 'res-9-26')
assert.equal(legal.docId('Ordinance 2-26 - Amending the Village Zoning Map', null), 'ord-2-26')
assert.equal(legal.docId('Resolution No. 37-25 CSMs - Griesbach', null), 'res-37-25')
assert.equal(legal.docType('RFP 2026 Street Tree'), 'notice')
assert.equal(legal.category('Resolution No. 37-26 JRB TID #3 Approval'), 'Finance & Development')
assert.equal(legal.category('Ordinance No. 15-26 Data Center Moratorium'), 'Land Use & Zoning')
assert.equal(legal.category('RFP 2026 Street Tree'), 'Planning & Recreation')

// Staff directory
const people = staff.parse(fx('staff_directory.html'))
assert.equal(people.length, 17, 'staff: row count')
const knuth = people.find((p) => p.name === 'Katrina Knuth')!
assert.equal(knuth.title, 'Village Clerk')
assert.equal(knuth.department, 'Administration')
assert.equal(people.find((p) => p.name === 'Mark Mommaerts')!.department, 'Planning')
for (const p of people) {
  const blob = JSON.stringify(p)
  assert.ok(!/@|\(\d{3}\)|\d{3}-\d{4}/.test(blob), `staff: no email/phone stored for ${p.name}`)
}

// Village Board
const { board: members, commissionsText } = board.parse(fx('boards_and_commissions.html'))
assert.equal(members.length, 5, 'board: member count')
assert.deepEqual(members[0], {
  name: 'Jack Anderson',
  office: 'Village President',
  termNote: 'Elected April 2025',
  electedYear: 2025,
})
assert.equal(members[4].name, 'Brittany Helf')
assert.ok(!JSON.stringify(members).includes('[address]'), 'board: addresses never parsed')
assert.ok(commissionsText.startsWith('planning commission'), 'board: commission text isolated')

console.log('monitor parsers: all checks passed')
