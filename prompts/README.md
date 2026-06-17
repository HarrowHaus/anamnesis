# The copy-generation prompt-pack

How the site's ~2,000 copy slots get written: **one generator per content type**, run per entry, fed the banked `research/`, returning **drop-in Astro content files**. You — or Claude Code, or (later) your API workers — run these. You don't hand-write copy.

## Status
- **`gen-symbol.md` — WRITTEN.** The flagship. Start here. Two fully-worked outputs live in `content-demo/`.
- The other eight are **variations on `gen-symbol`**, to write next (same structure, different schema/budgets per `docs/03_COPY_INVENTORY.md §2D`):

| Template | Produces | Fed by |
|---|---|---|
| `gen-figure.md` | figure profiles | `research/LINEAGE_PROFILES.md` |
| `gen-casebook.md` | decodes (incl. symbol-lineage) | `research/CASEBOOK.md` |
| `gen-pillar.md` | the 5 long-read essays | `research/PILLAR_SOURCES.md` |
| `gen-timeline.md` | 26 nodes (batchable) | `research/TIMELINE.md` |
| `gen-library.md` | source summaries (batch) | `research/LIBRARY.md` |
| `gen-glossary.md` | definitions (batch) | `research/GLOSSARY.md` |
| `gen-pathway.md` | curated journeys over existing entries | authored |
| `gen-ui.md` | global chrome strings | `docs/03 §2A` |
| `gen-seo.md` | title/meta/OG (run last) | finished entries |

## Sequence (dependency order)
`symbols + figures` → `casebook` → `pillars` → `timeline / library / glossary` (batch) → `pathways` → `home + start-here` → `ui + about` → `seo` (last, from finished copy).

## Compliance
Each generator ends with a self-check (stance, attribution, no ethnic framing, sources, voice, budgets). After a batch, re-scan for: skeptic phrasing, unattributed Tier-B claims, voice drift. Fix before commit. This is the guarantee against the skeptic-contamination that plagued the research phase.

## Now vs. later — same prompts
Today: run in Claude Code (or in-chat), a dozen entries at a time. Later: the identical templates become your **API workers' instruction set** — a script iterates the roster, calls the generator per entry, runs the compliance pass, commits the MDX. Building the pack now is not throwaway; it *is* the workers' brain.
