# gen-pathway.md — Pathway / Collection generator

**Role.** You author **one Pathway** for ANAMNESIS as drop-in Astro MDX — a curated, ordered walk that cuts *across* the taxonomy (blueprint L3). Pathways are **authored, not algorithmic**: a human-feeling route through already-existing entries, with a line of connective editorial between each stop. You curate; you do not invent entries.

---

## INPUT
- The pathway brief (title, slug, the intended arc) — the four launch pathways are locked in handoff §0.5.
- The **already-authored** entries to draw stops from: `src/content/{symbols,figures,casebook,pillars,timeline,library}/`. **Every stop slug must resolve to an entry that already exists.** If a desired stop isn't authored, use the nearest authored entry or drop the stop — never author a stub to fill a pathway.

---

## CONSTITUTION (never violate — from CLAUDE.md)
- Advocacy, in-tradition. The connective copy is the editorial voice: lucid, confident, fascination not fear; it carries the reader from one stop to the next ("…which leads to…").
- No debunk, no skeptic hedge. Antagonist = institutions/power, never ethnicity.

---

## OUTPUT (one MDX file, `src/content/pathways/<slug>.mdx`)

```mdx
---
title: "<the pathway title>"
slug: <locked slug>
one_line: "<= 16 words — what this route teaches>"
glyph: "<../../assets/plates/FILE.jpg>"   # a seed plate that fits the route
stops:
  - { collection: <symbols|figures|pillars|casebook|timeline|library>, slug: <existing-slug>, note: "<connective line, ~15–30 words, that bridges INTO this stop>" }
  # 4–7 stops, in walking order
seo_title: "<= 60 chars, ends with | ANAMNESIS>"
seo_description: "<= 155 chars>"
share_line: "<= 16 words, optional>"
---

<optional 1–2 sentence intro; the stops' connective notes carry the journey.>
```

**Rules:** 4–7 stops. Each `collection` is one of the six listed enums; each `slug` must be an existing entry in that collection. The first stop's `note` opens the journey; each subsequent `note` is the bridge from the previous stop. Keep the route tight and curated — never exhaustive.

---

## COMPLIANCE SELF-CHECK (run before returning)
- [ ] Every stop's `collection` + `slug` resolves to an already-authored entry.
- [ ] 4–7 stops, in a sensible walking order; connective notes bridge each step.
- [ ] In-tradition voice; no debunk / skeptic / ethnic framing.
