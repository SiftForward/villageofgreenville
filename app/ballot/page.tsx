import type { Metadata } from 'next'
import { getBallotGuide, getSourceById, formatDate, isBallotElectionOver } from '@/lib/data'
import SourceBadge from '@/components/SourceBadge'
import type { BallotContest } from '@/types'

// Re-render hourly so the how-to-vote sections retire themselves after Election Day.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'On Your Ballot',
  description:
    'What Greenville voters will see on the November 3, 2026 General Election ballot, plus polling place, early voting hours and deadlines — drawn from official sources.',
}

const MYVOTE = {
  ballot: 'https://myvote.wi.gov/en-us/Whats-On-My-Ballot',
  polling: 'https://myvote.wi.gov/en-us/Find-My-Polling-Place',
  register: 'https://myvote.wi.gov/en-us/Register-To-Vote',
  absenteeInPerson: 'https://myvote.wi.gov/en-us/Vote-Absentee-In-Person',
  absenteeByMail: 'https://myvote.wi.gov/en-us/Vote-Absentee-By-Mail',
  track: 'https://myvote.wi.gov/en-us/Track-My-Ballot',
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  )
}

function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-navy no-underline hover:text-gold transition-colors bg-white border border-gold-muted px-4 py-2.5 rounded"
    >
      {children}
      <ExternalIcon />
    </a>
  )
}

function SourceLine({ ids }: { ids: string[] }) {
  const sources = ids.map((id) => getSourceById(id)).filter((s): s is NonNullable<typeof s> => !!s)
  if (!sources.length) return null
  return (
    <p className="font-sans text-xs text-warm-muted mt-3 leading-relaxed">
      Source:{' '}
      {sources.map((s, i) => (
        <span key={s.id}>
          {i > 0 && '; '}
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-1 hover:text-gold transition-colors">
            {s.name}
          </a>
        </span>
      ))}
      .
    </p>
  )
}

function ContestCard({ contest }: { contest: BallotContest }) {
  return (
    <div className="card p-5">
      <h3 className="font-serif text-lg font-semibold text-navy leading-snug">{contest.office}</h3>
      {contest.note && <p className="font-sans text-xs text-warm-muted mt-1">{contest.note}</p>}
      <ul className="mt-3 divide-y divide-warm-border">
        {contest.candidates.map((c) => (
          <li key={c.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2">
            <span className="font-sans text-sm text-navy">
              <span className="font-semibold">{c.name}</span>
              {c.runningMate && (
                <span className="text-warm-text">
                  {' '}
                  with {c.runningMate} for Lieutenant Governor
                </span>
              )}
            </span>
            <span className="font-sans text-xs uppercase tracking-wider text-warm-muted">{c.party}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function BallotPage() {
  const guide = getBallotGuide()
  const electionOver = isBallotElectionOver()
  const electionDay = formatDate(guide.electionDate)
  const statewide = guide.contests.filter((c) => c.scope === 'statewide')
  const county = guide.contests.filter((c) => c.scope === 'county')
  const outagamieResults = getSourceById('outagamie-election-results')
  const myvoteResults = getSourceById('myvote-election-results')

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Page header */}
      <div className="max-w-3xl mb-10">
        <p className="section-label mb-4">Elections</p>
        <div className="w-12 h-0.5 bg-gold mb-6" aria-hidden="true" />
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-navy mb-6 leading-tight">
          {electionOver ? 'The November 3, 2026 Ballot' : 'On Your Ballot'}
        </h1>
        <p className="font-sans text-lg text-warm-text leading-relaxed">
          {electionOver
            ? `Greenville voted in the ${guide.electionName} on ${electionDay}. This page is kept as a record of what was on the ballot.`
            : `Greenville votes in the ${guide.electionName} on ${electionDay}. Every Greenville voter sees the statewide and county contests below. The U.S. House, State Senate and State Assembly races depend on your address, so your exact ballot is on MyVote Wisconsin. This site does not ask for or store addresses.`}
        </p>
      </div>

      {electionOver ? (
        <div className="bg-gold-pale border border-gold-muted rounded p-6 mb-12 max-w-3xl">
          <p className="font-serif text-lg font-semibold text-navy mb-2">Looking for results?</p>
          <p className="font-sans text-sm text-warm-text leading-relaxed mb-4">
            Wisconsin has no single statewide results feed. Counties post unofficial election-night numbers, and results are not official until the county canvass is certified.
          </p>
          <div className="flex flex-wrap gap-3">
            {outagamieResults && <ButtonLink href={outagamieResults.url}>Outagamie County results</ButtonLink>}
            {myvoteResults && <ButtonLink href={myvoteResults.url}>MyVote Wisconsin results</ButtonLink>}
          </div>
        </div>
      ) : (
        <div className="bg-gold-pale border border-gold-muted rounded p-6 mb-12 max-w-3xl">
          <p className="font-serif text-lg font-semibold text-navy mb-2">See your own sample ballot</p>
          <p className="font-sans text-sm text-warm-text leading-relaxed mb-4">
            MyVote Wisconsin is the Wisconsin Elections Commission&rsquo;s official tool. Enter your address there, not here, to see every race and question that applies to you.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={MYVOTE.ballot}>What&rsquo;s On My Ballot</ButtonLink>
            <ButtonLink href={MYVOTE.polling}>Find My Polling Place</ButtonLink>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* How to vote — retires after Election Day */}
          {!electionOver && (
            <section>
              <div className="civic-rule mb-6">
                <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Voting in Greenville</h2>
              </div>
              <div className="card p-5 space-y-5">
                <div>
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted mb-1">Election Day</p>
                  <p className="font-sans text-sm text-navy">
                    <span className="font-semibold">{electionDay}</span>: polls are open from {guide.pollsOpen} to {guide.pollsClose}
                  </p>
                  <SourceLine ids={['outagamie-election-results']} />
                </div>

                <div className="border-t border-warm-border pt-5">
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted mb-1">Where to vote</p>
                  <p className="font-sans text-sm text-navy">
                    <span className="font-semibold">{guide.pollingPlace.name}</span>
                    <br />
                    {guide.pollingPlace.address}
                  </p>
                  <p className="font-sans text-sm text-warm-text mt-1">{guide.pollingPlace.scope}</p>
                  <p className="font-sans text-xs text-warm-muted mt-2 italic leading-relaxed">{guide.pollingPlace.note}</p>
                  <SourceLine ids={['wec-2026-general-election', 'greenville-elections']} />
                </div>

                <div className="border-t border-warm-border pt-5">
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted mb-1">
                    Early (in-person absentee) voting
                  </p>
                  <p className="font-sans text-sm text-navy">
                    <span className="font-semibold">{guide.inPersonAbsentee.location}</span>, {guide.inPersonAbsentee.address}
                  </p>
                  <ul className="font-sans text-sm text-warm-text mt-1 space-y-0.5">
                    {guide.inPersonAbsentee.hours.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <SourceLine ids={['greenville-elections']} />
                </div>

                <div className="border-t border-warm-border pt-5">
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted mb-1">Deadlines</p>
                  <ul className="font-sans text-sm text-warm-text space-y-2">
                    {guide.deadlines.map((d) => (
                      <li key={d.label}>
                        {d.label}: <span className="text-navy font-semibold">{d.when}</span>
                      </li>
                    ))}
                  </ul>
                  <SourceLine ids={['wec-election-hub']} />
                </div>

                <div className="border-t border-warm-border pt-5">
                  <p className="font-sans text-xs font-bold uppercase tracking-wider text-warm-muted mb-1">Photo ID and questions</p>
                  <p className="font-sans text-sm text-warm-text leading-relaxed">
                    Photo ID is required to vote, whether in person or by mail. Questions about voting in Greenville: Village Clerk&rsquo;s office, {guide.clerkPhone}.
                  </p>
                  <SourceLine ids={['greenville-elections']} />
                </div>
              </div>
            </section>
          )}

          {/* Statewide offices */}
          <section>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="civic-rule flex-1">
                <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Statewide offices</h2>
              </div>
              <SourceBadge tier="primary_official" url="https://elections.wi.gov/elections" />
            </div>
            <p className="font-sans text-sm text-warm-text leading-relaxed mb-5">
              Every Wisconsin voter sees these contests. Candidates are listed in the order and with the party labels in the Elections Commission&rsquo;s official list. This site does not endorse or rank candidates.
            </p>
            <div className="space-y-4">
              {statewide.map((c) => (
                <ContestCard key={c.id} contest={c} />
              ))}
            </div>
            <SourceLine ids={['wec-2026-general-election']} />
          </section>

          {/* Statewide questions */}
          <section>
            <div className="civic-rule mb-6">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Statewide questions</h2>
            </div>
            <div className="card p-5">
              <ul className="divide-y divide-warm-border">
                {guide.questions.map((q) => (
                  <li key={q.number} className="py-2 first:pt-0 last:pb-0 font-sans text-sm text-navy">
                    <span className="font-semibold">Question {q.number}:</span> {q.title}
                  </li>
                ))}
              </ul>
              <p className="font-sans text-xs text-warm-muted mt-4 leading-relaxed">
                These are the Elections Commission&rsquo;s titles for the three statewide questions. The exact wording voters answer is printed on the ballot; read it on your sample ballot before you vote. This site does not summarize or take a position on them.
              </p>
            </div>
            <SourceLine ids={['wec-2026-general-election']} />
          </section>

          {/* County */}
          <section>
            <div className="civic-rule mb-6">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Outagamie County</h2>
            </div>
            <div className="space-y-4">
              {county.map((c) => (
                <ContestCard key={c.id} contest={c} />
              ))}
            </div>
            <SourceLine ids={['wec-2026-general-election']} />
          </section>

          {/* Address-dependent races */}
          <section>
            <div className="civic-rule mb-6">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">Races that depend on your address</h2>
            </div>
            <div className="card p-5">
              <p className="font-sans text-sm text-warm-text leading-relaxed mb-3">
                Which of these appear on your ballot, and who is running, depends on the districts your address falls in:
              </p>
              <ul className="font-sans text-sm text-navy list-disc pl-5 space-y-1 mb-4">
                {guide.addressDependent.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                {!electionOver && <ButtonLink href={MYVOTE.ballot}>What&rsquo;s On My Ballot</ButtonLink>}
                <ButtonLink href="https://elections.wi.gov/elections">Commission&rsquo;s full contest list</ButtonLink>
              </div>
            </div>
          </section>

          {/* Not on the ballot */}
          <section>
            <div className="civic-rule mb-6">
              <h2 className="font-serif text-2xl font-semibold text-navy pt-4">What is not on this ballot</h2>
            </div>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              The Elections Commission&rsquo;s official list shows no Village of Greenville offices or Village referendum this November; Village Board elections are held in April. The only school district referendums it lists for Outagamie County are in the Little Chute Area and Seymour Community school districts. Check your sample ballot to confirm what applies to your address.
            </p>
            <SourceLine ids={['wec-2026-general-election']} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="inset-block">
            <p className="font-sans text-sm font-semibold text-navy mb-2">About this page</p>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              Contests, candidates and question titles are read from the Wisconsin Elections Commission&rsquo;s official contest list, last updated {formatDate(guide.candidateListUpdated)} and checked on {formatDate(guide.retrieved)}. Registered write-in candidates are listed separately by the Commission. If anything here differs from your sample ballot, the sample ballot and the official sources control.
            </p>
          </div>

          {!electionOver && (
            <div>
              <h2 className="font-serif text-xl font-semibold text-navy mb-4">MyVote Wisconsin tools</h2>
              <div className="card p-4">
                <ul className="font-sans text-sm space-y-2">
                  {[
                    { href: MYVOTE.ballot, label: 'What’s On My Ballot' },
                    { href: MYVOTE.polling, label: 'Find My Polling Place' },
                    { href: MYVOTE.register, label: 'Register To Vote' },
                    { href: MYVOTE.absenteeByMail, label: 'Vote Absentee By Mail' },
                    { href: MYVOTE.absenteeInPerson, label: 'Vote Absentee In Person' },
                    { href: MYVOTE.track, label: 'Track My Ballot' },
                  ].map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-navy hover:text-gold transition-colors underline underline-offset-2">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="inset-block">
            <p className="font-sans text-sm font-semibold text-navy mb-2">Independent and unofficial</p>
            <p className="font-sans text-sm text-warm-text leading-relaxed">
              VillageOfGreenville.com is not the Village of Greenville and not an election authority. For official election information, use MyVote Wisconsin, the Wisconsin Elections Commission, Outagamie County, or the Village Clerk.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
