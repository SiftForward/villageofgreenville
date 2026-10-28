import sourcesData from '@/data/sources.json'
import civicRosterData from '@/data/civic-roster.json'
import timelineData from '@/data/timeline.json'
import documentsData from '@/data/documents.json'
import editorialStandardsData from '@/data/editorial-standards.json'
import sourceHealthData from '@/data/source-health.json'
import changeLogData from '@/data/change-log.json'
import growthSignalsData from '@/data/growth-signals.json'
import staffDirectoryData from '@/data/staff-directory.json'

import type {
  Source,
  CivicMember,
  TimelineEvent,
  PublicDocument,
  EditorialPrinciple,
  SourceHealth,
  ChangeLogEntry,
  GrowthSignal,
  StaffMember,
} from '@/types'

// ─── Sources ─────────────────────────────────────────────────────────────────

export function getSources(): Source[] {
  return sourcesData as Source[]
}

export function getSourceById(id: string): Source | undefined {
  return (sourcesData as Source[]).find((s) => s.id === id)
}

/** Most recent date any source was checked, as stored (YYYY-MM-DD), or null if none. */
export function getLastCheckedDate(): string | null {
  const dates = (sourcesData as Source[]).map((s) => s.lastChecked).filter((d): d is string => !!d)
  return dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : null
}

/** "2026-10-28" → "October 28, 2026". Parsed as UTC so the day never shifts. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// ─── Civic roster ─────────────────────────────────────────────────────────────

export function getCivicRoster(): CivicMember[] {
  return civicRosterData as CivicMember[]
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export function getTimeline(): TimelineEvent[] {
  return (timelineData as TimelineEvent[]).sort((a, b) => a.year - b.year)
}

// ─── Documents ────────────────────────────────────────────────────────────────

export function getDocuments(): PublicDocument[] {
  return documentsData as PublicDocument[]
}

export function getDocumentsByCategory(): Record<string, PublicDocument[]> {
  const docs = getDocuments()
  return docs.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = []
      acc[doc.category].push(doc)
      return acc
    },
    {} as Record<string, PublicDocument[]>
  )
}

// ─── Editorial standards ──────────────────────────────────────────────────────

export function getEditorialStandards(): EditorialPrinciple[] {
  return editorialStandardsData as EditorialPrinciple[]
}

// ─── Source health registry ───────────────────────────────────────────────────

export function getSourceHealth(): SourceHealth[] {
  return sourceHealthData as SourceHealth[]
}

export function getSourceHealthById(sourceId: string): SourceHealth | undefined {
  return (sourceHealthData as SourceHealth[]).find((h) => h.sourceId === sourceId)
}

export function getSourceWithHealth(): Array<{ source: Source; health: SourceHealth | undefined }> {
  const sources = getSources()
  return sources.map((source) => ({
    source,
    health: getSourceHealthById(source.id),
  }))
}

// ─── Change log ───────────────────────────────────────────────────────────────

export function getChangeLog(): ChangeLogEntry[] {
  return (changeLogData as ChangeLogEntry[]).sort(
    (a, b) => new Date(b.dateDetected).getTime() - new Date(a.dateDetected).getTime()
  )
}

// ─── Growth signals ───────────────────────────────────────────────────────────

export function getGrowthSignals(): GrowthSignal[] {
  return growthSignalsData as GrowthSignal[]
}

export function getGrowthSignalById(id: string): GrowthSignal | undefined {
  return (growthSignalsData as GrowthSignal[]).find((g) => g.id === id)
}

// ─── Staff directory ──────────────────────────────────────────────────────────

export function getStaffDirectory(): StaffMember[] {
  return staffDirectoryData as StaffMember[]
}

export function getStaffByDepartment(): Record<string, StaffMember[]> {
  return (staffDirectoryData as StaffMember[]).reduce(
    (acc, member) => {
      if (!acc[member.department]) acc[member.department] = []
      acc[member.department].push(member)
      return acc
    },
    {} as Record<string, StaffMember[]>
  )
}
