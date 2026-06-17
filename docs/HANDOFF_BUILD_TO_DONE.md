# ANAMNESIS — MASTER BUILD HANDOFF (current state → fully actualized)

This is the single source of truth for finishing the entire project, not just an MVP. It is written so the executing agent **never makes an unrecorded decision**. Every roster, route, schema field, facet, and rule below is already decided and sourced from this repo. If you reach a fork that is *not* covered here, **STOP and ask Bug — do not guess, do not invent, do not "sprint ahead."** That rule overrides everything else.

Starting point (audited from the real build): the Astro scaffold, the full 15-component kit, the relational graph, placeholder grayscale tokens, the conversion-spine pages (home, dictionary index + entry, one casebook decode, Start Here), and two motion set-pieces (Casebook assemble, Start descent) are **done**. Everything in Phases A–F below is what remains.

---

## HOW TO RUN THIS HANDOFF

1. **One phase at a time, in order (A→F).** Do not start a phase until the previous one's checkpoint passes.
2. **Use the agent pack already in `.claude/`:** the `orchestrator` plans each phase and delegates; `content-generator` writes entries; `compliance-reviewer` checks stance/sourcing; `committer` commits + pushes. The `gen-symbols` command + the PostToolUse validator hook run automatically.
3. **Checkpoint = all of:** `npm run build` passes (it runs `astro check && astro build`); `npm run validate:content` is green; reduced-motion verified on any new motion; the page renders mobile-first. Only then does `committer` commit.
4. **Commit per phase-step** with the message given in that step. Never force-push; never commit secrets.
5. **The skin is Phase F (locked, below) — not out of scope.** Until that phase, tokens stay the neutral grayscale placeholder and plates stay `grayscale(1)`; the build is verified structurally first, then Phase F drops the real skin in through the token seams in one pass. Ship (Phase G) runs last so Lighthouse/contrast are checked on the real palette.

---

## §0 — LOCKED GLOBAL DECISIONS (do not re-decide)

### 0.1 Route table (the finished sitemap)
Mirror the canonical patterns: **index pages** copy the structure of `src/pages/dictionary/index.astro`; **detail pages** copy `src/pages/dictionary/[symbol].astro`. `active` = the masthead slug in the same row.

| Route (file) | Type | `active` | Status |
|---|---|---|---|
| `/` `src/pages/index.astro` | home | — | built (hero upgrade in E) |
| `/start` `src/pages/start.astro` | on-ramp | start | built |
| `/dictionary` + `/dictionary/[symbol]` | index+detail | dictionary | built |
| `/figures` `src/pages/figures/index.astro` | index | figures | **build (A1)** |
| `/figures/[figure]` `src/pages/figures/[figure].astro` | detail | figures | **build (A1)** |
| `/casebook` `src/pages/casebook/index.astro` | index | casebook | **build (A2)** |
| `/casebook/[case]` | detail | casebook | built |
| `/about` `src/pages/about.astro` | static | — | **build (A3)** |
| `/search` `src/pages/search.astro` | tool | — | **build (A4)** |
| `/pillars` + `/pillars/[slug]` | index+detail | pillars | **build (B3)** |
| `/timeline` `src/pages/timeline.astro` | scroll-story | timeline | **build (C)** |
| `/library` + `/library/[source]` | index+detail | library | **build (D1)** |
| `/glossary` `src/pages/glossary.astro` | index | — | **build (D2)** |
| `/pathways/[slug]` `src/pages/pathways/[slug].astro` | journey | — | **build (D3)** |

**LOCKED naming decision:** the figures section is **`/figures`** (not `/lineage`). Reason: the built `Masthead.astro` already links `/figures` and the collection is named `figures`. The index page's H1 may read "The Lineage," breadcrumb label "Figures." Do not introduce `/lineage`.

### 0.2 The eight symbol categories (the dictionary facet taxonomy)
`solar-astro · sacred-geometry · alchemical · fraternal-masonic · corporate · civic-national · religious · occult` (dossier §7 + schema). Blends like `civic-solar` in demo entries are allowed by the schema; facet/group on the canonical eight.

### 0.3 Content rosters — the canonical lists already exist in `research/`
Do **not** invent or omit entries. Generate exactly what each research file enumerates:
| Collection | Source file | Target count |
|---|---|---|
| symbols | `research/SYMBOL_DICTIONARY.md` | full roster (~50–64), incl. the 14 already done |
| figures | `research/LINEAGE_PROFILES.md` | ~33, incl. the 5 already done |
| casebook | `research/CASEBOOK.md` | ~17–22, incl. the 1 already done |
| timeline | `research/TIMELINE.md` | ~27 nodes |
| library | `research/LIBRARY.md` | ~24 |
| glossary | `research/GLOSSARY.md` | ~62 terms |
| pillars | `research/PILLAR_SOURCES.md` + dossier §5 | exactly 5 (below) |
| pathways | §0.5 below | 4 |

### 0.4 The five pillars (locked titles + order — dossier §5)
- **P1 — Who Controls the Image** (keystone) · `order: 1` · slug `who-controls-the-image`
- **P2 — The War on Images** · `order: 2` · slug `the-war-on-images`
- **P3 — Astrotheology & the Sky-Code** · `order: 3` · slug `astrotheology-and-the-sky-code`
- **P4 — The Engineering of Consent** · `order: 4` · slug `the-engineering-of-consent`
- **P5 — Symbolic Illiteracy & the AI Image Age** (2026 capstone) · `order: 5` · slug `symbolic-illiteracy-and-the-ai-image-age`
P5 must use **current sources (2024–2026)**, date-stamped, flagged fast-moving.

### 0.5 The four launch pathways (locked — blueprint L3)
Authored in `src/content/pathways/`, 4–7 stops each, stops are slugs into existing collections:
1. **Follow the Eye** `follow-the-eye` — eye-of-horus → all-seeing-eye → great-seal-pyramid → (corporate eye logos).
2. **The Sky-Code in Five Plates** `the-sky-code` — sun-cross → zodiac/saturn → as-above-so-below → P3.
3. **How Persuasion Was Built** `how-persuasion-was-built` — Bernays (figure) → P4 → a corporate casebook → fasces.
4. **Logos Hiding in Plain Sight** `logos-hiding-in-plain-sight` — corporate-category symbols → matching casebook decodes.
Exact stop slugs: choose only from **already-authored** entries at build time; if a desired stop isn't authored yet, use the nearest authored entry or drop the stop — never author a stub just to fill a pathway.

### 0.6 Search (locked approach — no external dependency)
Client-side only. At build, emit a static JSON index of every entry (`{collection, slug, title, one_line, category, tier, url}`) to `/public/search-index.json` (or a generated endpoint). `/search` renders `SearchBar` + a results grid using the card system, reads `?q=`, and filters the JSON client-side — mirror the live-filter `<script>` already in `dictionary/index.astro`. Wire the masthead's search button to navigate to `/search`.

### 0.7 SEO / share / feeds (locked)
- Every entry already carries `seo_title`, `seo_description`, optional `share_line`. Confirm `Base.astro` emits `<title>`, meta description, and Open Graph/Twitter tags (`og:title/description/image`), using `plateUrl(glyph)` for the image. Add the tags if missing.
- Add `@astrojs/sitemap` → `sitemap-index.xml`.
- Add `@astrojs/rss` → `/rss.xml` over **casebook** (the viral surface) + **pillars**.
- `ShareCard.astro` already exists; ensure each shareable detail page can produce its OG line from `share_line || one_line`.

### 0.8 Stance & sourcing (locked — dossier §1, §11; enforced by validator + compliance-reviewer)
- **Advocacy.** Present the tradition's case at full strength. **Not** a debunk site.
- **Tier A** (hard history/scholarship) stated as fact. **Tier B** (the figures' works) always attributed — "Maxwell argues…", never asserted as settled.
- **Antagonist = power structures** (state, church, advertising, media, platforms) — **never ethnicity**. Any "secret cabal of [group]" framing is forbidden.
- **Living people** (Icke, Tsarion, Bonacci, …): describe stated claims + published work, attribute everything, assert no defamatory facts about them as individuals.
- Child-safety: nothing sexualizing minors anywhere.
- Every entry needs ≥1 source; the body keeps documented-fact and attributed-reading layers structurally distinct.

### 0.9 Acceptance gates (every phase — docs §6/§7)
Mobile-first renders · graph links resolve **both** directions · `prefers-reduced-motion` honored (set-pieces degrade to static) · stance/sourcing compliant · `npm run build` clean · `npm run validate:content` green · Lighthouse ≥ 90 mobile before ship (Phase G), on the real Phase-F palette.

---

## §1 — CONTENT GENERATION PROTOCOL (locked per collection)

For each entry: read its row in the source research file → map to the frontmatter schema in `src/content.config.ts` (authoritative) → write the MDX body in the required sections → run validator. Slugs are kebab-case of the name; filename = `<slug>.mdx`. Cross-links are slug strings (an entry may point at a not-yet-authored target). Generators: `prompts/gen-symbol.md` and `prompts/gen-figure.md` exist; **create the missing ones** (`gen-casebook.md`, `gen-pillar.md`, `gen-timeline.md`, `gen-library.md`, `gen-glossary.md`, `gen-pathway.md`) by copying their shape before bulk-generating that type.

**Required MDX body sections by collection:**
- **symbols:** `## Documented origin` (Tier-A fact) · `## The reading` (attributed) · `## Where it hides today`.
- **figures:** short profile body; frontmatter carries `core_claims`, `key_works`, `signature_examples`, `influenced_by/influenced`. Attribute all claims; living-person rule applies.
- **pillars:** the essay body; frontmatter `thesis`, `key_claims`, `historical_anchors` (Tier-A spine), `proponents`→figures, `example_slots`→casebook, `related_symbols`.
- **casebook:** `## The surface` · `## The decode` (attributed) · `## Symbol-lineage` (component symbols, in `assemble` order with x/y % for §5.4). `who_made_this_claim`→figures.
- **timeline:** one node each — `date`, numeric `sort`, `era` ∈ {sacred, mechanical, algorithmic}, `event`, `why_it_matters` (the image-control angle), `linked_figures/symbols`.
- **library:** `title`, `author`, `year`, `type`, `tier`, `link`, `summary`, `used_by` (backlinks resolve at build).
- **glossary:** `term`, `definition` (plain language), `see_also`, `related_symbols/figures`.
- **pathways:** ordered `stops[]` (`collection` + `slug` + connective `note`).

After any batch: `compliance-reviewer` reviews stance/attribution; fix; then `committer` commits `content(<collection>): add <n> entries`.

---

## PHASE A — Close the gaps in the built work *(no new content; unblocks what exists)*

> Paste-ready goal: "Build the missing routes that make already-authored content reachable and fix broken links. Mirror `dictionary/index.astro` for indexes and `dictionary/[symbol].astro` for details. Touch no tokens/palette."

**A1 — Figures index + profile (rescues the 5 orphaned figures).**
- Create `src/components/FigureProfile.astro` mirroring `SymbolEntry.astro`'s structure, rendering from the `figures` schema: name · dates · `tier` (founder/ancestor/peer/backbone) · `one_line` · `core_claims` (list) · `key_works` (link each to `/library/[slug]` when that source exists, else plain text) · `signature_examples` (link to casebook/dictionary) · influence lists `influenced_by`/`influenced` (link to `/figures/[slug]`) · `sources` via `SourceRow` · body slot.
- Create `src/pages/figures/index.astro` (mirror dictionary index): `active="figures"`, H1 "The Lineage", eyebrow "Who carried the image". Grid of `FigureCard`. Facet bar = **tier** (founder/ancestor/peer/backbone) + live text filter. EmptyState on no match.
- Create `src/pages/figures/[figure].astro` (mirror symbol detail): `getStaticPaths` from `figures`; Breadcrumbs (Home › Figures › name); `EntrySurface variant="full"` wrapping `FigureProfile`; `PrevNext` wrap-around across figures (alpha by name).
- Checkpoint → commit `feat(figures): index + profile routes; surfaces 5 authored figures`.

**A2 — Casebook index.**
- Create `src/pages/casebook/index.astro` (mirror dictionary index): `active="casebook"`, H1 "The Casebook", eyebrow "Decoded in the open". Grid of `CasebookCard`. Facets = **decoded-by** (union of `who_made_this_claim`) + live text filter. "Design for the screenshot" — this is the viral surface.
- Checkpoint → commit `feat(casebook): browsable index`.

**A3 — About / Method.**
- Create `src/pages/about.astro` (static, `SiteLayout`, no `active`). Sections from dossier §1 & §11: **Mission** · **Method** (the relational web is invisible; editorial, sourced) · **Sourcing standard** (Tier A asserted / B attributed / C sparing, explained) · **Posture** (advocacy; antagonist = institutions not ethnicity; living people attributed). Plain editorial prose.
- Fixes the existing broken footer `/about` link.
- Checkpoint → commit `feat(about): method + sourcing page`.

**A4 — Global search.**
- Implement §0.6: build `/public/search-index.json` (a small build script or an Astro endpoint `src/pages/search-index.json.ts` that maps all collections). Create `src/pages/search.astro` = `SearchBar` + results grid (card system) filtering the JSON on `?q=`, mirroring the dictionary filter script. Wire the masthead search button → `/search`.
- Checkpoint → commit `feat(search): client-side search over all collections`.

**A5 — Nav truth pass.**
- The masthead already links figures/pillars/casebook/timeline/library. After A1–A4 those that exist resolve; leave pillars/timeline/library links in place (they light up as built). Verify no remaining link points at a 404 except not-yet-built sections (acceptable, finished in B–D). Add the four pathways entry point to the home pathways strip in Phase D3.
- Checkpoint → commit `chore(nav): verify masthead targets`.

---

## PHASE B — Finish the MVP conversion slice to spec *(docs §7 step 2)*

**B1 — Symbols 14 → full roster.** Generate every remaining symbol in `research/SYMBOL_DICTIONARY.md` via `gen-symbols` (content-generator → compliance-reviewer → validator). Batch ~8–10, commit per batch `content(symbols): batch N`.
**B2 — Casebook 1 → ~5 (then on to full in D4).** Create `gen-casebook.md`, generate 4 priority decodes (the Great Seal is done); include `assemble[]` x/y markers so each decode powers the §5.4 set-piece. Commit `content(casebook): +4 decodes`.
**B3 — Pillars (all five) + routes.** Create `gen-pillar.md`. Write **P1 first** (keystone), then P2–P5 (P5 with 2024–2026 sources). Create `src/pages/pillars/index.astro` (the five as `FeatureBlock`/list, ordered by `order`) and `src/pages/pillars/[slug].astro` (mirror detail: `ReadingBody` for the essay + `thesis`/`key_claims`/`historical_anchors` + linked proponents/examples/symbols + `SourceRow` + `PrevNext` across the five). Commit `feat(pillars): five essays + routes`.

**B4 — Close graph integrity (run before Phase C).** B1–B3 author entries that cite figures/symbols not yet written, leaving the validator with dangling cross-links. Per the acceptance gate "graph links resolve both ways," close them before moving on so the validator is a clean baseline for C/D.
- Author the figure profiles every `decoded_by` / `who_made_this_claim` already cites but that have no entry. Those present in `research/LINEAGE_PROFILES.md` (e.g. `william-cooper`, `michael-tsarion`, `robert-sepehr`, `freeman-fly`) author from the file; any cited figure **not** in the research (e.g. `d-m-murdock`, `eliphas-levi`) author from their documented works **and add a matching entry to `research/LINEAGE_PROFILES.md`** so roster and content stay in sync. Living-person rules (§0.8) apply; `UNVERIFIED` for unconfirmed dates.
- New figures' frontmatter cross-links point ONLY at existing slugs; `key_works` as plain titles until the library exists (D1) — introduce no new dangling refs.
- Remove `related_symbols` references that point at non-roster entries (e.g. `the-sephiroth`, `emerald-tablet`) rather than inventing entries for them.
- **Nav guard:** render unbuilt nav items (`/timeline`, `/library`, `/glossary`) as disabled/non-clickable until their pages exist — keep them in the IA, no clickable link to a route with no page.
- Run `npm run build` (stay 0 errors) + `npm run validate:content`; confirm warnings drop to ~0. Commit `content(figures): author cited profiles + sync roster; drop dead refs; guard unbuilt nav — closes Phase B graph integrity`.

---

## PHASE C — Timeline *(docs §7 step 3 + §5.5)*

**C1 — Content.** Create `gen-timeline.md`; generate all `research/TIMELINE.md` nodes with `sort` keys + `era` ∈ {sacred, mechanical, algorithmic}. Commit `content(timeline): full roster`.
**C2 — Scroll-story page.** Create `src/pages/timeline.astro` (`active="timeline"`) using the existing `TimelineNode` component, ordered by `sort`, grouped into the three eras (acts). Implement the §5.5 pinned, scrubbed scroll-story in GSAP/ScrollTrigger **exactly like `CasebookAssemble.astro`'s reduced-motion pattern**: a jump-rail to skip; under `prefers-reduced-motion` it degrades to a static vertical list. Commit `feat(timeline): scroll-story`.

---

## PHASE D — Remaining sections + full rosters *(docs §7 step 5 + complete content)*

**D1 — Library.** Create `gen-library.md`; generate `research/LIBRARY.md`. Build `src/pages/library/index.astro` (grid/list of `SourceRow`; facets = **type** {book/lecture/film/article/engraving/artifact/other} + **tier** {A/B/C} + text filter) and `src/pages/library/[source].astro` (source detail + `used_by` backlinks resolved at build). Commit `feat(library): routes + sources`.
**D2 — Glossary.** Create `gen-glossary.md`; generate `research/GLOSSARY.md`. Build `src/pages/glossary.astro` — alphabetical definition list + live text filter + first-letter jump-rail; each term cross-links `related_symbols/figures`. Commit `feat(glossary): all terms`.
**D3 — Pathways.** Create `gen-pathway.md`; author the **four** pathways (§0.5) from already-authored entries. Build `src/pages/pathways/[slug].astro` using `PathwayStop` between stops + `PrevNext`. Add a `PathwayCard` strip to the **home** page (blueprint L3). Commit `feat(pathways): four journeys + home strip`.
**D4 — Fill all rosters to full.** Finish any remaining: symbols → full `SYMBOL_DICTIONARY.md`; figures → full `LINEAGE_PROFILES.md`; casebook → full `CASEBOOK.md`. Batch + compliance + commit per batch.

---

## PHASE E — Motion completeness + polish *(docs §5)*

**E1 — Home hero §5.1 "veil parts".** Upgrade `src/pages/index.astro` from static feature block to the set-piece (GSAP), reduced-motion → static. Keep the home composition: Masthead · Start-Here affordance · the hero · Feature block · Pathways strip (from D3) · Footer.
**E2 — Symbol entry §5.3 "develops".** Add the one glyph-resolve moment on `/dictionary/[symbol]` arrival (IntersectionObserver/GSAP), reduced-motion safe.
**E3 — Reduced-motion audit.** Verify every set-piece (Start, Casebook, Timeline, Home, Symbol) degrades to clean static. Commit `feat(motion): home hero + entry resolve; reduced-motion audited`.

---

## PHASE F — Design / Duotone skin *(locked — replaces the grayscale placeholder in one pass)*

**Source of truth:** `mockup_E_atlas_actualized.html` (Bug's approved direction). The skin is applied through the seams the build already exposes — `src/styles/tokens.css` (the `--color-*`, `--font-*`, and the eight `--way-*` slots), `src/styles/base.css` (the plate filter), and `src/lib/plates.ts` — so this is a **re-skin via tokens, not a rebuild**. Because every component reads from these tokens, any value below stays tunable later by editing one file; "locked" means the system and the default values are decided, not that hues are frozen forever.

**Governing principle (locked):** *less gaudy, less safe.* One constrained, high-minded editorial palette derived from mockup_E — restraint over rainbow. The category duotones are **low-chroma, ink-weighted** (a refined tinted near-monochrome), never poppy; one bold motion (datamosh) carries the edge.

**F1 — Type.** Set `--font-display: Archivo` (700/900), `--font-body: Spectral`, `--font-ui: "Space Mono"` in `tokens.css`; add the font `<link>` (Google Fonts or @fontsource) in `Base.astro`. Keep the existing fluid scale/spacing tokens.

**F2 — Base palette + neo-brutalist tokens.** In `tokens.css` set: `--color-bg` vellum `#F1E9D6`, `--color-surface` `#FAF3E2`, `--color-text` oak-gall ink `#1A1612`, `--color-text-muted` `#6B655A`, `--color-border` ink, and the border/shadow tokens to the mockup language — `--border-w: 2.5px` solid ink, hard offset shadow `5px 5px 0` (no blur), zero radius on structural elements. Do **not** invent values outside mockup_E's register.

**F3 — The duotone IS the category facet (locked).** Plates stop being `grayscale(1)` and become a **two-tone duotone tinted by the entry's category** — so color and facet are one language (per §0.2's eight categories). Implement at the single seam: in `base.css` swap the plate `filter` for a per-category duotone (SVG `feComponentTransfer` color-transfer, or pre-baked variants) selected from the `--way-*` token on the entry's category; wire `plates.ts` to emit the category data-attribute the filter keys off. Assign the eight `--way-*` tokens, all kept **low-saturation** (refined from mockup_E's cobalt/coral/gold/lilac so a category's grid reads as one tasteful tone):
- `--way-solar` (solar-astro) → gold `#C8922E`
- `--way-civic` (civic-national) → cobalt `#3450C4`
- `--way-corp` (corporate) → coral-red `#D8452E`
- `--way-relig` (religious) → lilac `#8E79C9`
- `--way-sacred` (sacred-geometry) → slate-blue `#3E6B9E`
- `--way-masonic` (fraternal-masonic) → ink-teal `#2F6E6A`
- `--way-alchem` (alchemical) → verdigris `#3C7A55`
- `--way-occult` (occult) → oxblood `#8E3B52`
Map these onto the existing `--way-dictionary/figures/…` slots by section as needed. The shadow pole of every duotone is `--color-text` (ink) and the highlight pole is vellum, so the whole site reads as one constrained object. Tune chroma down (not up) if any grid feels loud — the bar is "high-minded magazine," not "data-viz."

**F4 — Chrome + wayfinding.** Facet chips, active states, the category eyebrow/label, and the per-section "you are here" signature use the same `--way-*` color (slightly brighter is allowed in chrome for legibility). This is the L8 wayfinding the blueprint deferred to "the palette phase" — now delivered.

**F5 — Datamosh hero (the one bold motion).** Rebuild the home hero (with E1) so the lead engraving channel-splits / slips on load — the engineered image caught being engineered. GSAP, runs once, **freezes to a clean static plate under `prefers-reduced-motion`**. Sparing; it's the only place datamosh appears.

**F6 — Acceptance.** Side-by-side against `mockup_E`; every plate duotoned by category; the eight categories visually distinguishable but unified; AA contrast on text + chrome over vellum (re-run after this phase, not before); reduced-motion freezes the mosh; `npm run build` clean. Commit `feat(design): apply brutalist-grimoire skin + category duotone (from mockup_E)`.

---

## PHASE G — Ship

**G1 — SEO/feeds:** implement §0.7 (OG tags in `Base.astro`, `@astrojs/sitemap`, `@astrojs/rss` for casebook + pillars). Verify each detail page emits its share-card line.
**G2 — A11y + performance:** keyboard nav, focus states, alt text on plates, color-contrast **on the real Phase-F palette**, Lighthouse ≥ 90 mobile on home + dictionary + a symbol + a casebook.
**G3 — Deploy:** build, deploy (Cloudflare Pages), smoke-test the spine + one entry of every type. Commit `chore(release): ship v1`.

---

## DEFINITION OF DONE (the whole project)
- Every route in §0.1 exists and renders mobile-first; masthead + footer link only to live pages.
- Every research roster fully generated: ~50+ symbols, ~33 figures, ~17+ casebook decodes, 5 pillars, ~27 timeline nodes, ~24 library sources, ~62 glossary terms, 4 pathways — all stance/sourcing compliant (validator + compliance-reviewer green).
- The relational graph resolves both directions on every entry (where-next, decoded-by, appears-in, influenced-by/→, used-by, on-the-timeline).
- All five motion set-pieces live (Home, Start, Symbol, Casebook, Timeline), each with a reduced-motion fallback.
- Search works across all collections; SEO/OG/sitemap/RSS in place; Lighthouse ≥ 90 mobile.
- The brutalist-grimoire skin from Phase F is applied: category duotones live, type + tokens swapped from the grayscale placeholder, datamosh hero with reduced-motion fallback, matched against `mockup_E`.
- **No fork was resolved by guessing.** Anything not covered here was escalated to Bug.
