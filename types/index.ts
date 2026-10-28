// ─── Source types ────────────────────────────────────────────────────────────

export type TrustTier =
  | 'primary_official'
  | 'secondary_official'
  | 'unofficial'
  | 'community_submitted'

export type MonitoringMethod =
  | 'html_change_detection'
  | 'document_link_detection'
  | 'rss'
  | 'manual'

export type SourceType =
  | 'official_webpage'
  | 'official_document'
  | 'official_document_center'
  | 'official_county_webpage'
  | 'state_official_reference'
  | 'state_official_lookup'
  | 'official_gis_hub'
  | 'county_gis'
  | 'state_data'

export interface Source {
  id: string
  name: string
  url: string
  type: SourceType
  trustTier: TrustTier
  monitoringMethod: MonitoringMethod | null
  note: string | null
  lastChecked: string | null
}

// ─── Civic roster ─────────────────────────────────────────────────────────────

export type StatusLabel =
  | 'current_official'
  | 'official_document'
  | 'unofficial'
  | 'pending'
  | 'adopted'
  | 'superseded'
  | 'needs_review'

export interface CivicMember {
  id: string
  name: string
  office: string
  status: StatusLabel
  termNote: string
  electedYear: number
  email: string | null
  sourceId: string
  lastVerified: string
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export type TimelineCategory =
  | 'founding'
  | 'name-change'
  | 'incorporation'
  | 'growth'
  | 'government'
  | 'other'

export interface TimelineEvent {
  id: string
  year: number
  event: string
  detail: string
  sourceId: string | null
  category: TimelineCategory
}

// ─── Public documents ─────────────────────────────────────────────────────────

export type DocumentType = 'resolution' | 'ordinance' | 'notice' | 'report' | 'plan'

// The document as posted/detected on an official source
export type DocumentStatus =
  | 'official_document_posted'
  | 'draft'
  | 'superseded_document'
  | 'archived'

// Whether this site has reviewed the source link
export type DocumentReviewStatus =
  | 'reviewed_source_link'
  | 'pending_review'
  | 'auto_detected'

// Whether the formal civic action (vote, adoption) is verified
export type CivicStatus =
  | 'adoption_status_not_independently_verified'
  | 'formally_adopted_confirmed'
  | 'pending_vote'
  | 'withdrawn'

export interface PublicDocument {
  id: string
  title: string
  type: DocumentType
  date: string | null
  documentStatus: DocumentStatus
  reviewStatus: DocumentReviewStatus
  civicStatus: CivicStatus
  sourceId: string
  category: string
  url: string | null
  notes: string | null
}

// ─── Editorial standards ──────────────────────────────────────────────────────

export interface EditorialPrinciple {
  id: string
  title: string
  body: string
  icon: string
}

// ─── Source health registry ───────────────────────────────────────────────────

export type AutomationReadiness = 'high' | 'medium' | 'low'

export type SourceRegistryStatus =
  | 'registered'
  | 'reviewed'
  | 'needs_review'
  | 'active_monitoring_future'

export interface SourceHealth {
  sourceId: string
  publisher: string
  automationReadiness: AutomationReadiness
  reviewStatus: SourceRegistryStatus
  lastReviewed: string | null
  publicNotes: string | null
}

// ─── Change log ───────────────────────────────────────────────────────────────

export type ChangeType =
  | 'document_indexed'
  | 'source_registered'
  | 'roster_verified'
  | 'timeline_verified'
  | 'data_corrected'
  | 'status_updated'

export type ChangePublicStatus = 'published' | 'pending_review' | 'archived'

export type ChangeReviewStatus = 'human_reviewed' | 'auto_detected' | 'pending'

export interface ChangeLogEntry {
  id: string
  changeTitle: string
  sourceId: string | null
  changeType: ChangeType
  dateDetected: string
  publicStatus: ChangePublicStatus
  reviewStatus: ChangeReviewStatus
  summary: string
  linkToSource: string | null
}

// ─── Staff directory ──────────────────────────────────────────────────────────

export interface StaffMember {
  id: string
  name: string
  title: string
  department: string
  email: string | null
  sourceId: string
  lastVerified: string
}

// ─── Growth signals ───────────────────────────────────────────────────────────

export type GrowthSignalStatus =
  | 'data_available'
  | 'source_registered'
  | 'extraction_pending'
  | 'monitoring_planned'

export interface GrowthDataPoint {
  label: string
  value: string
}

export interface GrowthSignal {
  id: string
  topic: string
  description: string
  primarySourceId: string | null
  planningDocId: string | null
  status: GrowthSignalStatus
  stats: GrowthDataPoint[]
  pendingNote: string | null
}

// ─── Ballot guide ─────────────────────────────────────────────────────────────

export interface BallotCandidate {
  name: string
  /** Lieutenant Governor candidate on the same ticket, when the office has one. */
  runningMate?: string
  party: string
}

export interface BallotContest {
  id: string
  office: string
  /** Who sees this contest on their ballot. */
  scope: 'statewide' | 'county'
  note: string | null
  candidates: BallotCandidate[]
}

export interface BallotQuestion {
  number: number
  title: string
}

export interface BallotDeadline {
  label: string
  when: string
  sourceId: string
}

export interface BallotGuide {
  electionName: string
  /** YYYY-MM-DD */
  electionDate: string
  /** Date the Elections Commission last updated its contest file. */
  candidateListUpdated: string
  /** Date this site last read the official sources. */
  retrieved: string
  pollsOpen: string
  pollsClose: string
  clerkPhone: string
  pollingPlace: { name: string; address: string; scope: string; note: string }
  inPersonAbsentee: { location: string; address: string; hours: string[] }
  deadlines: BallotDeadline[]
  contests: BallotContest[]
  questions: BallotQuestion[]
  addressDependent: string[]
}
