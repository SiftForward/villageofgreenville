import Link from 'next/link'
import { getSources, getCivicRoster, getTimeline, getDocuments, getLastCheckedDate, formatDate } from '@/lib/data'
import StatusBadge, { DocumentStatusBadge } from '@/components/StatusBadge'
import SourceBadge from '@/components/SourceBadge'

export const metadata = {
  title: 'VillageOfGreenville.com — The Community Record',
}

const trackingItems = [
  {
    href: '/timeline',
    label: 'Greenville History',
    description:
      'From Greenville Station in 1848 to Village incorporation in 2021 — a documented record of the community\'s development.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: '/who-represents',
    label: 'Who Represents Greenville',
    description:
      'Current Village Board members, offices, and term information — sourced directly from official Village records.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/public-records',
    label: 'Public Records',
    description:
      'Resolutions, ordinances, legal notices, and official documents — indexed and labeled with source and status.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    href: '/growth-development',
    label: 'Growth & Development',
    description:
      'Population trends, land use decisions, TIF districts, and development data — drawn from official GIS and state sources.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
]

const editorialPromises = [
  'Official sources are labeled clearly. Non-official content is marked.',
  'Uncertainty and gaps are stated — not hidden or papered over.',
  'AI assists organization but does not auto-publish unreviewed claims.',
  'Residential addresses are not displayed, even when publicly listed.',
]

export default function HomePage() {
  const sources = getSources()
  const lastChecked = getLastCheckedDate()
  const civicRoster = getCivicRoster()
  const timeline = getTimeline()
  const documents = getDocuments()

  const primaryOfficialSources = sources.filter((s) => s.trustTier === 'primary_official')
  const recentTimeline = timeline.slice(-3).reverse()
  const previewMembers = civicRoster.slice(0, 3)
  const boardsSource = sources.find((s) => s.id === 'greenville-boards')

  return (
    <div>
      {/* ── Hero / Masthead ── */}
      <section className="relative bg-cream grain-overlay overflow-hidden border-b border-warm-border">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Section label */}
            <p className="section-label mb-6">Greenville, Wisconsin 54942</p>

            {/* Gold rule */}
            <div className="w-12 h-0.5 bg-gold mb-6" aria-hidden="true" />

            {/* Main heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-navy leading-[1.05] tracking-tight mb-6 text-balance">
              Greenville&rsquo;s public record, organized for residents.
            </h1>

            <p className="font-sans text-lg md:text-xl text-warm-text leading-relaxed mb-8 max-w-2xl">
              VillageOfGreenville.com is an independent community record for Greenville, Wisconsin —
              organizing local history, civic records, public decisions, and growth signals from
              source-linked public information.
            </p>

            {/* Independence notice */}
            <div className="inline-flex items-start gap-3 bg-gold-pale border border-gold-muted rounded px-4 py-3 max-w-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gold mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="font-sans text-sm text-navy leading-relaxed">
                <span className="font-semibold">Independent community website.</span> Not affiliated with the official Village of Greenville government. For official services, visit{' '}
                <a href="https://greenvillewi.gov/" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2 hover:text-gold-light">
                  greenvillewi.gov
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Decorative right element */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-warm-border/20 to-transparent pointer-events-none" aria-hidden="true" />
      </section>

      {/* ── What This Site Is ── */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="section-label mb-4">About This Site</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy mb-6 civic-rule pt-4">
              What This Site Is
            </h2>
            <div className="font-sans text-base text-warm-text leading-relaxed space-y-4 max-w-prose">
              <p>
                VillageOfGreenville.com is an independent community record for Greenville, Wisconsin. It is not a government website. It is not a news organization. It is a structured, source-driven effort to make public information about Greenville easier to find and understand.
              </p>
              <p>
                Every claim on this site is tied to a source. Every source is labeled with a trust tier. When information is uncertain, incomplete, or in need of review, this site says so. The goal is a reliable reference — not a fast one.
              </p>
              <p>
                A weekly check watches the Village's Legal Notices, Staff Directory and Boards &amp; Commissions pages. Anything new is reviewed before it appears here.
                {lastChecked && <> Last checked {formatDate(lastChecked)}.</>}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="section-label mb-4">Source Coverage</p>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-serif text-3xl font-semibold text-navy">{primaryOfficialSources.length}</span>
                <SourceBadge tier="primary_official" />
              </div>
              <p className="font-sans text-sm text-warm-text">Primary official sources registered and reviewed, including Village, county, and state records.</p>
              <div className="mt-4 space-y-1">
                {primaryOfficialSources.slice(0, 4).map((s) => (
                  <div key={s.id} className="text-xs font-sans text-warm-muted truncate">{s.name}</div>
                ))}
                {primaryOfficialSources.length > 4 && (
                  <div className="text-xs font-sans text-gold">+{primaryOfficialSources.length - 4} more</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Track ── */}
      <section className="bg-navy grain-overlay">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="mb-10">
            <p className="section-label text-gold mb-4">Coverage</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-warm-white">
              What This Site Tracks
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trackingItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="no-underline group block bg-navy-light border border-navy-muted rounded p-6 hover:bg-navy-muted transition-colors"
              >
                <div className="text-gold mb-4">{item.icon}</div>
                <h3 className="font-serif text-lg font-semibold text-warm-white mb-2 group-hover:text-gold-light transition-colors">
                  {item.label}
                </h3>
                <p className="font-sans text-sm text-warm-border leading-relaxed">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Methodology Strip ── */}
      <section className="border-y border-warm-border bg-cream">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <div className="mb-8">
            <p className="section-label mb-2">How It Works</p>
            <h2 className="font-serif text-2xl font-semibold text-navy">
              How the Community Record Works
            </h2>
          </div>
          <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', label: 'Public source identified', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
              { step: '02', label: 'Record registered', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { step: '03', label: 'Change detected or manually reviewed', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
              { step: '04', label: 'Facts extracted and labeled', icon: 'M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h2zM16 16l4 4M16 20l4-4' },
              { step: '05', label: 'Human review completed', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { step: '06', label: 'Plain-English record published', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            ].map((item, idx, arr) => (
              <li key={item.step} className="flex flex-col gap-3 relative">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px bg-warm-border" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <span className="font-sans text-[0.6rem] font-bold tracking-wider uppercase text-gold block mb-0.5">{item.step}</span>
                  <p className="font-sans text-xs font-medium text-navy leading-snug">{item.label}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Timeline Preview ── */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-4">History</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy civic-rule pt-4">
              Greenville Timeline
            </h2>
          </div>
          <Link
            href="/timeline"
            className="font-sans text-sm font-semibold text-navy no-underline hover:text-gold transition-colors flex items-center gap-1.5"
          >
            Full timeline
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentTimeline.map((event) => (
            <div key={event.id} className="card p-6">
              <div className="font-serif text-3xl font-semibold text-gold mb-2 tabular-nums">{event.year}</div>
              <h3 className="font-serif text-lg font-semibold text-navy leading-snug mb-2">{event.event}</h3>
              <p className="font-sans text-sm text-warm-text leading-relaxed">{event.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Civic Roster Preview ── */}
      <section className="bg-cream border-y border-warm-border">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-4">Representation</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy civic-rule pt-4">
                Who Represents Greenville?
              </h2>
            </div>
            <Link
              href="/who-represents"
              className="font-sans text-sm font-semibold text-navy no-underline hover:text-gold transition-colors flex items-center gap-1.5"
            >
              Full roster
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {previewMembers.map((member) => (
              <div key={member.id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="section-label">{member.office}</span>
                  <StatusBadge status={member.status} />
                </div>
                <div>
                  <div className="font-serif text-lg font-semibold text-navy">{member.name}</div>
                  <div className="font-sans text-sm text-warm-text mt-0.5">{member.termNote}</div>
                </div>
                {boardsSource && (
                  <a
                    href={boardsSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-sans text-navy no-underline hover:text-gold transition-colors inline-flex items-center gap-1 mt-auto"
                  >
                    Source: Village Boards page
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="inset-block max-w-xl">
            <p className="font-sans text-sm text-warm-text">
              <span className="font-semibold text-navy">Address-specific officials:</span> For school board, state legislature, and other elected officials based on your address, use{' '}
              <a href="https://myvote.wi.gov/en-us/My-Elected-Officials" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-2 hover:text-gold-light">
                MyVote Wisconsin
              </a>
              . This site does not collect resident addresses.
            </p>
          </div>
        </div>
      </section>

      {/* ── Public Records Preview ── */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-4">Documents</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-navy civic-rule pt-4">
              Public Records Monitor
            </h2>
          </div>
          <Link
            href="/public-records"
            className="font-sans text-sm font-semibold text-navy no-underline hover:text-gold transition-colors flex items-center gap-1.5"
          >
            Full index
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.slice(0, 4).map((doc) => {
            const source = sources.find((s) => s.id === doc.sourceId)
            return (
              <div key={doc.id} className="card p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="section-label">{doc.type} &middot; {doc.category}</span>
                  <DocumentStatusBadge
                    documentStatus={doc.documentStatus}
                    reviewStatus={doc.reviewStatus}
                    civicStatus={doc.civicStatus}
                    className="flex-shrink-0"
                  />
                </div>
                <p className="font-serif text-base font-medium text-navy leading-snug mb-2">{doc.title}</p>
                {doc.notes && <p className="font-sans text-sm text-warm-text">{doc.notes}</p>}
                {source && (
                  <div className="mt-3 pt-3 border-t border-warm-border">
                    <SourceBadge tier={source.trustTier} url={source.url} label="Legal Notices" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Editorial Promise ── */}
      <section className="bg-navy-dark">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-label text-gold mb-4">Editorial Standards</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-warm-white mb-8">
              The Editorial Promise
            </h2>
            <ul className="space-y-4 text-left mb-10">
              {editorialPromises.map((promise, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-gold">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="font-sans text-sm text-warm-border leading-relaxed">{promise}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-gold no-underline hover:text-gold-light transition-colors border border-gold/30 hover:border-gold/60 px-5 py-2.5 rounded"
            >
              Read all editorial standards
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
