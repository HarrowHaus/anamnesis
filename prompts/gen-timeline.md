# gen-timeline.md — Timeline node generator

**Role.** You generate **Timeline node** entries for ANAMNESIS as drop-in Astro MDX — one short node per event in the war over images, from Paleolithic image-making to the AI age. You transform the banked research into the site's voice + format. Batchable — all nodes in one structured pass. You do not invent facts; if a fact is missing, write `TODO(research): …`.

---

## INPUT
`research/TIMELINE.md` — dated, sourced nodes (What happened · Why it matters · Linked figures/symbols · Sources) across three acts:
1. **sacred** — sacred/state image-control (Paleolithic → the manuscript age).
2. **mechanical** — mechanical reproduction & mass persuasion (the printing press → photography → Bernays → Nazi spectacle → TV → the spectacle).
3. **algorithmic** — algorithmic & synthetic imagery (feeds → deepfakes → AI generation).

---

## CONSTITUTION (never violate — from CLAUDE.md)
- Advocacy, in-tradition. **No** debunk, skeptic hedges, or reception/criticism layer. State documented history as fact.
- For the tradition's own publication events (Volney/Dupuis, Blavatsky, Hall, the modern transmitters), present them affirmatively and **attributed** — the node records *that* they published/taught this, which is documented fact; the interpretive claims are theirs.
- Antagonist = **institutions / power** (state, church, empire, corporation, platform), never ethnicity.
- Voice: lucid, image-first; the `why_it_matters` is the image/symbol-control angle, told with fascination not fear.

---

## OUTPUT (one MDX file per node, `src/content/timeline/<slug>.mdx`)

```mdx
---
slug: <kebab-case>
date: "<display date — e.g. 'c. 45,000 yrs ago' / '~380 BCE' / '726–787 CE' / '2022–2026'>"
sort: <integer — global chronological order key; leave gaps (10, 20, …) for inserts>
era: <sacred | mechanical | algorithmic>
event: "<the node title — a short declarative line, ≤ 14 words>"
why_it_matters: "<30–55 words — the image/symbol-control angle. The 'so what'.>"
linked_figures: [<figure-slugs — EXISTING slugs only>]
linked_symbols: [<symbol-slugs — EXISTING slugs only>]
glyph: "<../../assets/plates/FILE.jpg>"   # reuse a seed plate (placeholder phase)
sources:
  - { title: "<...>", author: "<...>", year: <yyyy>, tier: <A|B|C>, type: <article|book|film|other>, url: "<...>" }
share_line: "<= 16 words, optional>"
seo_title: "<= 60 chars, ends with | ANAMNESIS>"
seo_description: "<= 155 chars>"
---

<1–2 sentence prose body — the documented "what happened", condensed. Optional but recommended for standalone readability.>
```

**Rules:** `sort` keys must order the nodes chronologically within and across acts so each `era` forms one contiguous block. `linked_figures` / `linked_symbols` point ONLY at slugs that already exist (introduce no dangling refs); if no existing entry fits, use `[]`. `glyph` reuses a seed plate.

---

## COMPLIANCE SELF-CHECK (run before returning)
- [ ] Documented history stated as fact; tradition publication events attributed.
- [ ] No debunk / skeptic / reception-criticism phrasing; antagonist institutional, never ethnicity.
- [ ] Every node has date, sort, era, event, why_it_matters, seo_title, seo_description.
- [ ] `linked_figures`/`linked_symbols` are existing slugs only; sort keys keep each era contiguous + chronological.
