import type { Metadata } from 'next'
import { getDocuments, getSources } from '@/lib/data'
import DocumentIndex from '@/components/DocumentIndex'
import SourceBadge from '@/components/SourceBadge'
import StatusBadge from '@/components/StatusBadge'

export const metadata: Metadata = {
  title: 'Public Records',
  description:
    'Resolutions, ordinances, legal notices, and official documents from the Village of Greenville — indexed with source and status labels.',
}

export default function PublicRecordsPage() {
  const documents = getDocuments()
  const sources = getSources()

  const legalNoticesSource = sources.find((s) => s.id === 'greenville-legal-notices')
  const mainSource = sources.find((s) => s.id === 'greenville-main')

  const resolutions = documents.filter((d) => d.type === 'resolution')
  const ordinances = documents.filter((d) => d.type === 'ordinance')

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Page header */}
      <div className="max-w-3xl mb-12">
        <p className="section-label mb-4">Official Documents</p>
        <div className="w-12 h-0.5 bg-gold mb-6" aria-hidden="true" />
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-navy mb-6 leading-tight">
          Public Records Monitor
        </h1>
        <p className="font-sans text-lg text-warm-text leading-relaxed">
          Resolutions, ordinances, and legal notices from the Village of Greenville. Each record is labeled with a status and linked to its official source. This index is seeded from the Village Legal Notices page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-4 mb-10 p-4 card">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">{documents.length}</span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">Total Records</p>
                <p className="font-sans text-xs text-warm-text">in this index</p>
              </div>
            </div>
            <div className="w-px h-10 bg-warm-border" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">{resolutions.length}</span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">Resolutions</p>
              </div>
            </div>
            <div className="w-px h-10 bg-warm-border" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">{ordinances.length}</span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">Ordinances</p>
              </div>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-sans font-bold tracking-wider uppercase bg-status-official-bg text-status-official border border-status-official-border">
                Official Documents Posted
              </span>
            </div>
          </div>

          {/* Document index */}
          <DocumentIndex documents={documents} sources={sources} groupByCategory={true} />

          {/* Source note */}
          <div className="mt-10 inset-block">
            <p className="font-sans text-sm font-semibold text-navy mb-2">About this index</p>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              Records in this index are drawn from the Village of Greenville Legal Notices and Postings page. A daily check adds newly posted documents, marked Auto-detected, after review. Their titles are shown as posted; contents and adoption status are not verified.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Primary Sources</h2>
            <div className="space-y-3">
              {[legalNoticesSource, mainSource].filter(Boolean).map((s) => s && (
                <div key={s.id} className="card p-4">
                  <SourceBadge tier={s.trustTier} className="mb-2" />
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm font-medium text-navy no-underline hover:text-gold transition-colors block leading-snug"
                  >
                    {s.name}
                  </a>
                  {s.monitoringMethod && (
                    <p className="font-sans text-xs text-warm-muted mt-1">
                      Monitoring: {s.monitoringMethod.replace(/_/g, ' ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Status Key</h2>
            <div className="card p-4 space-y-3">
              {[
                { status: 'adopted' as const, note: 'Formally approved by the Village Board' },
                { status: 'pending' as const, note: 'Under consideration or awaiting vote' },
                { status: 'superseded' as const, note: 'Replaced by a newer document' },
                { status: 'needs_review' as const, note: 'Requires review before use' },
              ].map((s) => (
                <div key={s.status} className="flex items-start gap-2">
                  <StatusBadge status={s.status} className="flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-warm-text leading-relaxed">{s.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Document Types</h2>
            <div className="card p-4 space-y-3">
              {[
                { type: 'Resolution', note: 'A formal statement or decision by the Village Board, typically for policy, planning, or approval matters.' },
                { type: 'Ordinance', note: 'A Village law — amends the Municipal Code or zoning map. Has the force of local law once adopted.' },
                { type: 'Notice', note: 'A required public posting — meeting notices, hearing announcements, and statutory disclosures.' },
              ].map((t) => (
                <div key={t.type}>
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-navy mb-0.5">{t.type}</p>
                  <p className="font-sans text-xs text-warm-text leading-relaxed">{t.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="inset-block">
            <p className="font-sans text-sm font-semibold text-navy mb-2">How this index is updated</p>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              Every morning a check reads the Legal Notices page for new document links. New links are proposed for review and only appear here once approved. See the{' '}
              <code className="text-xs font-mono bg-cream px-1 py-0.5 rounded">scripts/</code>{' '}
              directory in the project repository.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
