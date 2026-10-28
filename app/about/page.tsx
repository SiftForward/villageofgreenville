import type { Metadata } from 'next'
import Link from 'next/link'
import { getEditorialStandards, getSources } from '@/lib/data'
import EditorialPrinciples from '@/components/EditorialPrinciples'
import SourceBadge from '@/components/SourceBadge'

export const metadata: Metadata = {
  title: 'About & Standards',
  description:
    'Editorial principles, source policy, AI use guidelines, and the independence statement for VillageOfGreenville.com.',
}

const trustTiers = [
  {
    tier: 'primary_official' as const,
    label: 'Primary Official',
    description:
      'Official government websites, certified documents, and statutory public records. These are the highest-confidence sources used on this site.',
    examples: ['greenvillewi.gov', 'Outagamie County Clerk', 'Wisconsin DOA', 'MyVote Wisconsin'],
  },
  {
    tier: 'secondary_official' as const,
    label: 'Secondary Official',
    description:
      'Official-adjacent sources such as press releases, meeting minutes summaries, or aggregated government data not in primary form.',
    examples: ['Meeting minutes summaries', 'Official social media channels'],
  },
  {
    tier: 'unofficial' as const,
    label: 'Unofficial',
    description:
      'Community-submitted or third-party information that has not been independently verified against a primary official source.',
    examples: ['Community observations', 'Local news coverage', 'Social media reports'],
  },
]

export default function AboutPage() {
  const principles = getEditorialStandards()
  const sources = getSources()

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Page header */}
      <div className="max-w-3xl mb-16">
        <p className="section-label mb-4">Editorial Standards</p>
        <div className="w-12 h-0.5 bg-gold mb-6" aria-hidden="true" />
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-navy mb-6 leading-tight">
          About This Site &amp; Our Standards
        </h1>
        <p className="font-sans text-lg text-warm-text leading-relaxed">
          VillageOfGreenville.com is an independent community record for Greenville, Wisconsin. These are the principles that govern how information is collected, labeled, reviewed, and published on this site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        <div className="lg:col-span-2">
          {/* Editorial principles */}
          <section className="mb-16">
            <div className="civic-rule mb-8">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Editorial Principles</h2>
            </div>
            <EditorialPrinciples principles={principles} />
          </section>

          {/* AI Use */}
          <section className="mb-16">
            <div className="civic-rule mb-6">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">How AI Is Used Here</h2>
            </div>
            <div className="inset-block">
              <p className="font-sans text-sm text-warm-text leading-relaxed mb-3">
                Artificial intelligence assists in organizing source data, drafting summaries, and structuring the information architecture of this site. AI is a tool for reducing the labor of civic record-keeping — it is not a replacement for sourced research or human review.
              </p>
              <ul className="space-y-2">
                {[
                  'AI-generated summaries require review before appearing on public pages.',
                  'AI does not auto-publish factual claims about individuals, votes, or documents.',
                  'Judging whether a source is trustworthy is a human step. Automated checks detect changes and, when nothing has changed, refresh the “last checked” and “last verified” dates; they never publish new content.',
                  'AI-assisted content is clearly distinguished from primary source material.',
                ].map((item, idx) => (
                  <li key={idx} className="font-sans text-sm text-warm-text flex items-start gap-2">
                    <span className="text-gold mt-0.5 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Corrections */}
          <section className="mb-16">
            <div className="civic-rule mb-6">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Corrections</h2>
            </div>
            <p className="font-sans text-sm text-warm-text leading-relaxed mb-4">
              If information on this site is inaccurate, outdated, or missing important context, we want to know. Corrections are welcome and will be reviewed promptly.
            </p>
            <p className="font-sans text-sm text-warm-text leading-relaxed mb-6">
              To submit a correction, provide the specific page and claim in question, the corrected information, and a link to the primary source that supports the correction. Claims without a source will be evaluated on a case-by-case basis.
            </p>
            <div className="card p-5">
              <p className="font-sans text-sm font-semibold text-navy mb-1">Correction path</p>
              <p className="font-sans text-sm text-warm-text">
                Submit corrections via the GitHub repository for this project, or by contacting the site maintainer. Corrections and source links will be credited when the record is updated.
              </p>
            </div>
          </section>

          {/* Independence statement */}
          <section>
            <div className="civic-rule mb-6">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Independence Statement</h2>
            </div>
            <div className="bg-gold-pale border border-gold-muted rounded p-6">
              <p className="font-serif text-lg font-semibold text-navy mb-3">
                VillageOfGreenville.com is not affiliated with the official Village of Greenville government.
              </p>
              <p className="font-sans text-sm text-warm-text leading-relaxed mb-3">
                This site is an independent community effort. It is not operated by, affiliated with, funded by, or endorsed by the Village of Greenville, Outagamie County, or any government entity.
              </p>
              <p className="font-sans text-sm text-warm-text leading-relaxed">
                For official Village services, permits, meetings, and government communications, visit the official Village website at{' '}
                <a href="https://greenvillewi.gov/" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2 hover:text-gold-light font-medium">
                  greenvillewi.gov
                </a>
                .
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Trust tiers */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-6">Source Trust Tiers</h2>
            <div className="space-y-4">
              {trustTiers.map((tier) => (
                <div key={tier.tier} className="card p-4">
                  <div className="mb-2">
                    <SourceBadge tier={tier.tier} />
                  </div>
                  <p className="font-sans text-xs text-warm-text leading-relaxed mb-2">{tier.description}</p>
                  <p className="font-sans text-xs text-warm-muted">
                    <span className="font-semibold">Examples:</span> {tier.examples.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status labels */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Status Labels</h2>
            <div className="card p-4 space-y-3">
              {[
                { label: 'current_official', note: 'Active, verified from primary source' },
                { label: 'official_document', note: 'Published in official document center' },
                { label: 'adopted', note: 'Formally approved by governing body' },
                { label: 'pending', note: 'Under consideration or awaiting vote' },
                { label: 'unofficial', note: 'Not from a primary official source' },
                { label: 'superseded', note: 'Replaced by a newer document or record' },
                { label: 'needs_review', note: 'Flagged for human review before use' },
              ].map((s) => (
                <div key={s.label}>
                  <code className="text-xs font-mono text-navy bg-cream px-1.5 py-0.5 rounded">{s.label}</code>
                  <p className="font-sans text-xs text-warm-muted mt-0.5">{s.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registered sources */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Registered Sources</h2>
            <div className="space-y-2">
              {sources.map((s) => (
                <div key={s.id} className="card p-3">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs font-medium text-navy no-underline hover:text-gold transition-colors block leading-snug mb-1"
                  >
                    {s.name}
                  </a>
                  {s.note && (
                    <p className="font-sans text-xs text-warm-muted leading-relaxed">{s.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
