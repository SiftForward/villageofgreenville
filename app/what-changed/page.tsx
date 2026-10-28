import type { Metadata } from 'next'
import { getChangeLog, getSourceById, getLastCheckedDate, formatDate } from '@/lib/data'
import type { ChangeType, ChangeReviewStatus } from '@/types'

export const metadata: Metadata = {
  title: 'What Changed?',
  description:
    'A human-reviewed log of changes to the VillageOfGreenville.com public record — source registrations, document indexing, and civic data updates.',
}

const changeTypeLabels: Record<ChangeType, string> = {
  document_indexed: 'Document Indexed',
  source_registered: 'Source Registered',
  roster_verified: 'Roster Verified',
  timeline_verified: 'Timeline Verified',
  data_corrected: 'Data Corrected',
  status_updated: 'Status Updated',
}

const changeTypeClasses: Record<ChangeType, string> = {
  document_indexed:
    'bg-status-official-bg text-status-official border border-status-official-border',
  source_registered:
    'bg-civic-green-pale text-civic-green border border-civic-green-border',
  roster_verified:
    'bg-status-official-bg text-status-official border border-status-official-border',
  timeline_verified:
    'bg-status-unofficial-bg text-status-unofficial border border-status-unofficial-border',
  data_corrected:
    'bg-status-needs_review-bg text-status-needs_review border border-status-needs_review-border',
  status_updated:
    'bg-status-pending-bg text-status-pending border border-status-pending-border',
}

const reviewStatusConfig: Record<ChangeReviewStatus, { label: string; classes: string }> = {
  human_reviewed: {
    label: 'Human Reviewed',
    classes: 'bg-civic-green-pale text-civic-green border border-civic-green-border',
  },
  auto_detected: {
    label: 'Auto-Detected',
    classes:
      'bg-status-unofficial-bg text-status-unofficial border border-status-unofficial-border',
  },
  pending: {
    label: 'Pending Review',
    classes: 'bg-status-pending-bg text-status-pending border border-status-pending-border',
  },
}

export default function WhatChangedPage() {
  const entries = getChangeLog()
  const lastChecked = getLastCheckedDate()
  const humanReviewedCount = entries.filter((e) => e.reviewStatus === 'human_reviewed').length

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Page header */}
      <div className="max-w-3xl mb-12">
        <p className="section-label mb-4">Change Log</p>
        <div className="w-12 h-0.5 bg-gold mb-6" aria-hidden="true" />
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-navy mb-6 leading-tight">
          What Changed?
        </h1>
        <p className="font-sans text-lg text-warm-text leading-relaxed">
          A log of updates to this public record — source registrations, document indexing, civic data
          verification, and corrections. A weekly check detects changes to official sources;
          publication remains human-reviewed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-4 mb-10 p-4 card">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">
                {entries.length}
              </span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">
                  Log Entries
                </p>
                <p className="font-sans text-xs text-warm-text">in this record</p>
              </div>
            </div>
            <div className="w-px h-10 bg-warm-border" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-semibold text-navy tabular-nums">
                {humanReviewedCount}
              </span>
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted">
                  Human Reviewed
                </p>
                <p className="font-sans text-xs text-warm-text">before publication</p>
              </div>
            </div>
          </div>

          {/* Change log feed */}
          <div className="space-y-6">
            {entries.map((entry) => {
              const source = entry.sourceId ? getSourceById(entry.sourceId) : undefined
              const typeClasses = changeTypeClasses[entry.changeType]
              const typeLabel = changeTypeLabels[entry.changeType]
              const reviewConfig = reviewStatusConfig[entry.reviewStatus]

              const sourceUrl = source?.url
              const showViewSource =
                entry.linkToSource && entry.linkToSource !== sourceUrl

              return (
                <article key={entry.id} className="card p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.6rem] font-sans font-bold tracking-wider uppercase ${typeClasses}`}
                    >
                      {typeLabel}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.6rem] font-sans font-bold tracking-wider uppercase ${reviewConfig.classes}`}
                    >
                      {reviewConfig.label}
                    </span>
                    <span className="font-sans text-xs text-warm-muted ml-auto tabular-nums">
                      {entry.dateDetected}
                    </span>
                  </div>

                  <h2 className="font-serif text-lg font-semibold text-navy leading-snug mb-3">
                    {entry.changeTitle}
                  </h2>

                  <p className="font-sans text-sm text-warm-text leading-relaxed mb-4">
                    {entry.summary}
                  </p>

                  {(source || showViewSource) && (
                    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-warm-border">
                      {source && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-sans text-navy no-underline hover:text-gold transition-colors inline-flex items-center gap-1"
                        >
                          {source.name}
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M2 10L10 2M10 2H5M10 2v5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      )}
                      {showViewSource && (
                        <a
                          href={entry.linkToSource!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-sans text-navy no-underline hover:text-gold transition-colors inline-flex items-center gap-1"
                        >
                          View source
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M2 10L10 2M10 2H5M10 2v5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Change Types</h2>
            <div className="card p-4 space-y-2.5">
              {(Object.entries(changeTypeLabels) as [ChangeType, string][]).map(
                ([type, label]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.6rem] font-sans font-bold tracking-wider uppercase flex-shrink-0 ${changeTypeClasses[type]}`}
                    >
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="inset-block">
            <p className="font-sans text-sm font-semibold text-navy mb-2">About this log</p>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              Early entries were added by hand. Since October 2026 a weekly check of the Village's Legal
              Notices, Staff Directory and Boards &amp; Commissions pages proposes new entries. Each one is
              reviewed before it is published. Entries marked Auto-detected came from that check.
              {lastChecked && <> The most recent check was on {formatDate(lastChecked)}.</>}
            </p>
          </div>

          <div className="inset-block">
            <p className="font-sans text-sm font-semibold text-navy mb-2">Review policy</p>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              Every published entry has been reviewed by a human before appearing in this record.
              Automated detection will never publish directly to this log — it will always enter a
              review queue first. The one thing that updates without review is a &ldquo;last checked&rdquo; or
              &ldquo;last verified&rdquo; date, refreshed when an automated check confirms an official page still says
              what we recorded.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
