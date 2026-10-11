import type { Metadata } from 'next'
import { getSourceWithHealth } from '@/lib/data'
import SourceBadge from '@/components/SourceBadge'
import { AutomationBadge, RegistryStatusBadge } from '@/components/StatusBadge'

export const metadata: Metadata = {
  title: 'Source Health',
  description:
    'How VillageOfGreenville.com knows what it knows — every registered source labeled with trust tier, review status, and automation readiness.',
}

const publisherOrder = [
  'Village of Greenville',
  'Outagamie County Clerk',
  'Outagamie County',
  'Wisconsin Elections Commission',
  'Wisconsin Department of Administration',
  'Wisconsin Department of Revenue',
]

export default function SourceHealthPage() {
  const sourcesWithHealth = getSourceWithHealth()

  const reviewedCount = sourcesWithHealth.filter(
    ({ health }) => health?.reviewStatus === 'reviewed'
  ).length
  const highReadinessCount = sourcesWithHealth.filter(
    ({ health }) => health?.automationReadiness === 'high'
  ).length

  const grouped = sourcesWithHealth.reduce(
    (acc, item) => {
      const pub = item.health?.publisher ?? 'Other'
      if (!acc[pub]) acc[pub] = []
      acc[pub].push(item)
      return acc
    },
    {} as Record<string, typeof sourcesWithHealth>
  )

  const orderedPublishers = [
    ...publisherOrder.filter((p) => grouped[p]),
    ...Object.keys(grouped).filter((p) => !publisherOrder.includes(p)),
  ]

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Page header */}
      <div className="max-w-3xl mb-12">
        <p className="section-label mb-4">Transparency</p>
        <div className="w-12 h-0.5 bg-gold mb-6" aria-hidden="true" />
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-navy mb-6 leading-tight">
          Source Health
        </h1>
        <p className="font-sans text-lg text-warm-text leading-relaxed">
          Source Health shows how this site knows what it knows. Every source used in this public record is
          registered before its information is used — labeled with publisher, trust tier, review status, and
          automation readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-4 mb-10 p-4 card">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">
                {sourcesWithHealth.length}
              </span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">Sources</p>
                <p className="font-sans text-xs text-warm-text">in registry</p>
              </div>
            </div>
            <div className="w-px h-10 bg-warm-border" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">{reviewedCount}</span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">Reviewed</p>
                <p className="font-sans text-xs text-warm-text">source links confirmed</p>
              </div>
            </div>
            <div className="w-px h-10 bg-warm-border" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">
                {highReadinessCount}
              </span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">
                  High readiness
                </p>
                <p className="font-sans text-xs text-warm-text">ready for automation</p>
              </div>
            </div>
          </div>

          {/* Source list grouped by publisher */}
          <div className="space-y-10">
            {orderedPublishers.map((publisher) => (
              <section key={publisher}>
                <h2 className="font-serif text-xl font-semibold text-navy civic-rule pt-4 mb-6">
                  {publisher}
                </h2>
                <div className="space-y-4">
                  {grouped[publisher].map(({ source, health }) => (
                    <div key={source.id} className="card p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-base font-semibold text-navy no-underline hover:text-gold transition-colors leading-snug inline-flex items-center gap-1.5"
                          >
                            {source.name}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className="opacity-40 flex-shrink-0"
                            >
                              <path
                                d="M2 10L10 2M10 2H5M10 2v5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </div>
                        <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                          <SourceBadge tier={source.trustTier} />
                          {health && <AutomationBadge readiness={health.automationReadiness} />}
                          {health && <RegistryStatusBadge status={health.reviewStatus} />}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3 text-xs font-sans text-warm-muted">
                        <span>
                          Type:{' '}
                          <span className="text-navy font-medium">
                            {source.type.replace(/_/g, ' ')}
                          </span>
                        </span>
                        {source.monitoringMethod && (
                          <span>
                            Monitoring:{' '}
                            <span className="text-navy font-medium">
                              {source.monitoringMethod.replace(/_/g, ' ')}
                            </span>
                          </span>
                        )}
                        {health?.lastReviewed && (
                          <span>
                            Last reviewed:{' '}
                            <span className="text-navy font-medium">{health.lastReviewed}</span>
                          </span>
                        )}
                      </div>
                      {health?.publicNotes && (
                        <p className="font-sans text-sm text-warm-text leading-relaxed">
                          {health.publicNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Automation Readiness</h2>
            <div className="card p-4 space-y-3">
              {(
                [
                  {
                    readiness: 'high' as const,
                    note: 'Page structure supports automated change detection. Monitoring is planned for a future version.',
                  },
                  {
                    readiness: 'medium' as const,
                    note: 'Automation possible, pending API access or structure confirmation.',
                  },
                  {
                    readiness: 'low' as const,
                    note: 'Manual extraction required — PDF, Excel, or low-frequency updates.',
                  },
                ] as const
              ).map(({ readiness, note }) => (
                <div key={readiness} className="flex items-start gap-2">
                  <AutomationBadge readiness={readiness} className="flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-warm-text leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Review Status</h2>
            <div className="card p-4 space-y-3">
              {(
                [
                  {
                    status: 'reviewed' as const,
                    note: 'Source URL confirmed. Page structure documented. Ready for monitoring.',
                  },
                  {
                    status: 'registered' as const,
                    note: 'Source recorded in registry. Full structure review pending.',
                  },
                  {
                    status: 'needs_review' as const,
                    note: 'Previously reviewed. Requires re-review before use.',
                  },
                ] as const
              ).map(({ status, note }) => (
                <div key={status} className="flex items-start gap-2">
                  <RegistryStatusBadge status={status} className="flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-warm-text leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Trust Tiers</h2>
            <div className="card p-4 space-y-3">
              {(
                [
                  {
                    tier: 'primary_official' as const,
                    note: 'Official government or state agency source. Authoritative for its subject matter.',
                  },
                  {
                    tier: 'secondary_official' as const,
                    note: 'Official in scope, secondary in authority. Useful cross-reference.',
                  },
                  {
                    tier: 'unofficial' as const,
                    note: 'Not an official source. Used for context only, labeled prominently.',
                  },
                ] as const
              ).map(({ tier, note }) => (
                <div key={tier} className="flex items-start gap-2">
                  <SourceBadge tier={tier} className="flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-warm-text leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="inset-block">
            <p className="font-sans text-sm font-semibold text-navy mb-2">Automated checks</p>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              The Legal Notices, Staff Directory and Boards &amp; Commissions pages are checked every morning.
              Detected changes go to a review queue, not the public record, until a human approves them.
              Other high-readiness sources are candidates for the same check.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
