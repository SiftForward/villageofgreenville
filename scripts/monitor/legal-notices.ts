/**
 * Legal Notices & Postings → data/documents.json
 *
 * Adds documents newly posted on the Village document center, and fills in the
 * official link for documents already on the site that have none. Never removes or
 * rewrites reviewed records. Adoption status is never inferred from a posting.
 */
import * as cheerio from 'cheerio'
import type { PublicDocument, DocumentType } from '../../types'
import { clean, fetchHtml, norm, readJson, similarity, slugify, today, writeJson, type Finding } from './lib'

export const SOURCE_ID = 'greenville-legal-notices'
export const SOURCE_URL =
  'https://www.townofgreenville.com/government/legal_notices_and_postings.php'

export interface PostedDocument {
  title: string
  url: string
  date: string | null
  section: string
}

export function parse(html: string): PostedDocument[] {
  const $ = cheerio.load(html)
  const out: PostedDocument[] = []
  $('#categorties-wrap .outer-cat').each((_, cat) => {
    const section = clean($(cat).children('h3').first().clone().children().remove().end().text())
    $(cat)
      .find('ul.file-group > li')
      .each((_, li) => {
        const a = $(li).children('a[href]').first()
        if (!a.length) return
        const title = clean(a.text())
        const href = a.attr('href') ?? ''
        const url = href.replace(/\?t=\d+$/, '').replace(/ /g, '%20')
        const m = clean($(li).find('.rz-sort-options').text()).match(/(\d{2})-(\d{2})-(\d{4})/)
        const date = m ? `${m[3]}-${m[1]}-${m[2]}` : null
        if (title && url) out.push({ title, url, date, section })
      })
  })
  return out
}

export function docType(title: string): DocumentType {
  if (/^reso?lt?u?tion/i.test(title)) return 'resolution'
  if (/^ordinance/i.test(title)) return 'ordinance'
  return 'notice'
}

export function docId(title: string, date: string | null): string {
  const num = title.match(/^(resolution|resoltuion|ordinance)\s*(?:no\.?)?\s*(\d+)-(\d+)/i)
  if (num) return `${docType(title) === 'ordinance' ? 'ord' : 'res'}-${num[2]}-${num[3]}`
  return `${slugify(title, 48)}${date ? '-' + date.slice(0, 4) : ''}`
}

export function category(title: string): string {
  const t = title.toLowerCase()
  if (/fire|police|ems\b|public safety|voting|election/.test(t)) return 'Public Safety'
  if (/park|recreation|lions barn|tree|forestry|trail/.test(t)) return 'Planning & Recreation'
  if (/zoning|pud|csm|special exception|comp(rehensive)? plan|subdivision|data center|solar|plat|parcel|rezon/.test(t))
    return 'Land Use & Zoning'
  if (/tid|tax increment|developer|escrow|improvement|ecmar|fee|budget|bond|levy/.test(t))
    return 'Finance & Development'
  return 'Administration'
}

export async function run(): Promise<Finding[]> {
  const posted = parse(await fetchHtml(SOURCE_URL, 'legal_notices_and_postings.html'))
  if (posted.length === 0) {
    throw new Error(
      `[legal-notices] Parsed 0 documents from ${SOURCE_URL}. The page layout may have changed; nothing was written.`,
    )
  }

  const docs = readJson<PublicDocument[]>('documents.json')
  const byId = new Map(docs.map((d) => [d.id, d]))
  const byTitle = new Map(docs.map((d) => [norm(d.title), d]))
  const findings: Finding[] = []
  const added: PublicDocument[] = []
  const date = today()

  for (const p of posted) {
    const id = docId(p.title, p.date)
    const existing =
      byId.get(id) ??
      byTitle.get(norm(p.title)) ??
      docs.find((d) => d.url === p.url) ??
      // Un-numbered notices (bids, RFQs) may be retitled on this site: same type and
      // date with a broadly similar title counts as the same document.
      docs.find(
        (d) =>
          d.type === docType(p.title) &&
          d.type === 'notice' &&
          d.date === p.date &&
          similarity(norm(d.title).slice(0, 20), norm(p.title).slice(0, 20)) >= 0.6,
      )
    if (existing) {
      if (!existing.url) {
        existing.url = p.url
        findings.push({
          sourceId: SOURCE_ID,
          sourceUrl: SOURCE_URL,
          kind: 'updated',
          summary: `Official link added for “${existing.title}”.`,
        })
      }
      continue
    }
    if (byId.has(id) || added.some((d) => d.id === id)) continue
    const doc: PublicDocument = {
      id,
      title: p.title,
      type: docType(p.title),
      date: p.date,
      documentStatus: 'official_document_posted',
      reviewStatus: 'auto_detected',
      civicStatus: 'adoption_status_not_independently_verified',
      sourceId: SOURCE_ID,
      category: category(p.title),
      url: p.url,
      notes: `Auto-detected on the Village Legal Notices page (${p.section}) on ${date}. Title is shown as posted. The document's contents and any adoption vote have not been reviewed.`,
    }
    added.push(doc)
    findings.push({
      sourceId: SOURCE_ID,
      sourceUrl: SOURCE_URL,
      kind: 'added',
      summary: `${p.title}${p.date ? ` (document date ${p.date})` : ''}`,
    })
  }

  if (findings.length) {
    const all = [...docs, ...added].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    writeJson('documents.json', all)
  }
  return findings
}
