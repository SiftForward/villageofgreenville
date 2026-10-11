# VillageOfGreenville.com

**The Community Record — Greenville, Wisconsin 54942**

An independent community record site for Greenville, WI. Built on facts, public sources, and respect for residents. Not affiliated with the official Village of Greenville government.

---

## What This Site Is

VillageOfGreenville.com is a structured, source-driven effort to make public information about Greenville, Wisconsin easier to find and understand. It is:

- **Not a government website** — it is independent
- **Not a news organization** — it is a civic record
- **Not a real-time feed** — changes require human review before publication

Every claim is tied to a source. Every source is labeled with a trust tier. Uncertainty is stated explicitly.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS custom properties
- **Fonts:** Spectral (headings), Mulish (body) via `next/font/google`
- **Data:** Local JSON files in `/data`
- **Deployment:** Vercel

---

## Project Structure

```
villageofgreenville/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout — fonts, metadata, header/footer
│   ├── globals.css             # Global styles, CSS custom properties
│   ├── page.tsx                # Home page
│   ├── about/page.tsx          # About & Standards
│   ├── timeline/page.tsx       # Greenville Timeline
│   ├── who-represents/page.tsx # Civic Roster
│   ├── public-records/page.tsx # Public Records index
│   └── growth-development/page.tsx
├── components/                 # Shared UI components
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── DisclaimerBanner.tsx    # Independence notice
│   ├── SourceBadge.tsx         # Trust tier indicator
│   ├── StatusBadge.tsx         # Record status indicator
│   ├── RecordCard.tsx          # Public document card
│   ├── CivicRosterTable.tsx    # Village Board table
│   ├── Timeline.tsx            # Historical timeline
│   ├── DocumentIndex.tsx       # Document listing
│   └── EditorialPrinciples.tsx # Standards display
├── data/                       # JSON data files (source of truth)
│   ├── sources.json            # Monitored official sources
│   ├── civic-roster.json       # Village Board members
│   ├── timeline.json           # Historical events
│   ├── documents.json          # Public documents
│   └── editorial-standards.json
├── lib/
│   └── data.ts                 # Data access helpers
├── types/
│   └── index.ts                # TypeScript types
└── scripts/                    # Automation scripts (see below)
    ├── fetch-boards-and-commissions.ts
    ├── fetch-staff-directory.ts
    ├── fetch-legal-notices.ts
    └── check-source-changes.ts
```

---

## Data Files

All site data lives in `/data` as JSON files. This is the first-version approach — future versions may migrate to a database or CMS.

### `data/sources.json`

All monitored official sources. Each source has:
- `id` — stable identifier referenced by other records
- `name` — human-readable name
- `url` — direct link to the source
- `type` — one of: `official_webpage`, `official_document_center`, `state_data`, etc.
- `trustTier` — one of: `primary_official`, `secondary_official`, `unofficial`, `community_submitted`
- `monitoringMethod` — how the source is monitored: `html_change_detection`, `document_link_detection`, or `null`
- `note` — any important caveats (e.g., "election-night results are unofficial until certified")

### `data/civic-roster.json`

Village Board members. Each record has:
- `office`, `name`, `status`, `termNote`, `electedYear`
- `sourceId` — references a source in `sources.json`
- `lastVerified` — date the record was last verified against its source
- `email` — official email only (no personal contact info)

**Policy:** Residential addresses are never stored, even if publicly listed.

### `data/timeline.json`

Historical events, sorted by year. Each event has:
- `year`, `event`, `detail`, `category`
- `sourceId` — may be `null` if no primary source is yet documented (flagged for review)

### `data/documents.json`

Public records indexed from the Village Legal Notices page. Each record has:
- `title`, `type` (resolution, ordinance, notice, report, plan)
- `status` — one of: `adopted`, `pending`, `superseded`, `needs_review`, etc.
- `sourceId`, `reviewStatus` — `reviewed`, `pending_review`, or `auto_detected`
- `category` — editorial grouping (e.g., "Land Use & Zoning", "Planning & Recreation")

### `data/editorial-standards.json`

The editorial principles that govern this site, displayed on the About page.

---

## Source Policy

### Trust Tiers

| Tier | Description |
|------|-------------|
| `primary_official` | Official government websites, certified documents, statutory public records |
| `secondary_official` | Official-adjacent sources — press releases, aggregated government data |
| `unofficial` | Community-submitted or unverified third-party information |
| `community_submitted` | User-contributed content pending source verification |

### Status Labels

| Label | Meaning |
|-------|---------|
| `current_official` | Active, verified from primary source |
| `official_document` | Published in official document center |
| `adopted` | Formally approved by governing body |
| `pending` | Under consideration or awaiting vote |
| `unofficial` | Not from a primary official source |
| `superseded` | Replaced by a newer document or record |
| `needs_review` | Flagged for human review before use |

---

## Automation Plan (Future)

The `/scripts` directory contains placeholder scripts for future source monitoring automation. None are currently active.

### Planned monitoring pipeline

1. **`check-source-changes.ts`** — master runner, dispatches per-source monitors nightly
2. **`fetch-legal-notices.ts`** — detects new documents on the Legal Notices page
3. **`fetch-boards-and-commissions.ts`** — detects roster changes on the Boards page
4. **`fetch-staff-directory.ts`** — detects staff directory changes

### Key rules for automation

- **Never auto-publish.** All detected changes are written to a `.cache/` review queue.
- **Human review is required** before any change appears in `/data` or on the public site.
- **Privacy first.** Scripts must not collect or store residential addresses or personal phone numbers.
- **Election results are never certified on election night.** The monitoring pipeline must not treat unofficial results as final.

### Suggested implementation approach

1. Run scripts via Vercel Cron Jobs or GitHub Actions on a nightly schedule
2. On change detection: write pending records to `.cache/`
3. Use a GitHub issue, webhook, or email notification for the review step
4. After human review and approval, manually update the relevant `/data` JSON file
5. The Next.js site rebuilds automatically on the next Vercel deploy

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

Visit `http://localhost:3000` to see the site.

---

## Deployment (Vercel)

1. Push to GitHub
2. Connect to Vercel — it will auto-detect Next.js
3. No environment variables required for the base version
4. Deploy: Vercel builds with `npm run build` and serves the output

The site uses Next.js App Router with server components for data rendering. JSON files are imported directly and statically rendered at build time.

---

## Editorial Principles

1. We prioritize official and primary sources.
2. We separate facts from context.
3. We label uncertainty.
4. We use AI carefully — review is required before publication.
5. We welcome corrections with sources.
6. We respect Greenville residents — no residential addresses.
7. We are independent and not affiliated with the official Village government.

---

## Independence Statement

VillageOfGreenville.com is not affiliated with, operated by, or endorsed by the Village of Greenville or any government entity. For official Village services, visit [greenvillewi.gov](https://greenvillewi.gov/).

---

## Corrections

If information on this site is inaccurate or outdated, open an issue in this repository with:
- The specific page and claim
- The correct information
- A link to the primary source

---

*Greenville, WI 54942 &middot; Community record, not government*

---

## Daily source check

`.github/workflows/source-monitor.yml` runs every morning at about 6:17 AM Central (and on demand from the Actions tab). It:

1. Reads the Village **Legal Notices & Postings**, **Staff Directory** and **Boards & Commissions** pages (`scripts/monitor/`).
2. Writes proposed updates into `data/*.json`: new documents marked `auto_detected`, staff title changes and additions, Village Board changes, and one change-log entry per source.
3. Opens or updates a single pull request, **Source updates for review**, on the branch `auto/source-updates`, and GitHub emails you.
4. **Merging the pull request is the review step.** Vercel redeploys the site from `master`. Close the PR to reject the changes, or edit the files on the branch before merging.

Rules the monitor follows:

- It never infers adoption. New documents are `official_document_posted` with adoption not verified.
- It never stores home addresses, phone numbers or emails, even though the official pages list them.
- New Board members are added as `needs_review`. Commission membership is free text, so it is only fingerprinted, and a change is flagged in the PR for a manual check.
- If a page can't be loaded or parsed (for example after a redesign), that source is skipped, nothing is overwritten, and the run fails so GitHub emails you.

Commands:

```bash
npm run monitor        # check live sources and write proposed updates to data/
npm run monitor:test   # parser checks against saved pages in scripts/monitor/fixtures/
MONITOR_FIXTURES=scripts/monitor/fixtures npm run monitor   # dry run without network
```

One-time GitHub setting: **Settings → Actions → General → Workflow permissions →** "Read and write permissions" and "Allow GitHub Actions to create and approve pull requests".
