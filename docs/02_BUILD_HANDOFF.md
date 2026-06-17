# ANAMNESIS — BUILD & MOTION HANDOFF (v1)

*Hands the locked architecture (SITE_BLUEPRINT_v1) to whoever builds it — a human engineer or, more likely, Claude Code agents. Covers the tech approach, how content becomes files, the component build specs, the **scrollytelling choreography** (the Google Arts & Culture–style cinematic, beat by beat), and the agent orchestration that assembles it. Skin/palette is still deferred; this is structure + behavior + motion.*

---

## 1. TECH APPROACH (recommendation — confirm before build)

**Recommended: Astro + content collections (MDX), GSAP/ScrollTrigger for motion, CSS design tokens, static output.** Rationale:

- **Content-graph from files.** Every entry is a markdown/MDX file with typed frontmatter matching the dossier's content models (§2). The relational graph (symbol → figures → casebook → sources) is just frontmatter cross-references resolved at build — no database, no CMS, perfect for an agent/file-driven operator. This is the dossier's "static-generated" recommendation (§16).
- **Islands for interactivity.** Faceted browse, search, the entry drawer, and scrollytelling are hydrated islands; everything else ships as static HTML — fast, cheap, SEO-strong (the symbol entries are built to spread, so SEO + share-cards matter).
- **MDX = essays with embedded components.** Pillar long-reads and Casebook decodes can drop a live specimen-card or decode-figure mid-paragraph.
- **GSAP ScrollTrigger** is the production answer to the scrollytelling the sandbox couldn't do — pinned, scrubbed, reduced-motion-aware.

*Alternatives:* Next.js (if you later want server features / API workers in the same repo), Eleventy (lighter, less interactivity). Astro is the best fit for a content-first archive with a few rich motion surfaces. **Decision needed: confirm Astro, or name a constraint.**

---

## 2. DATA MODEL → FILES (the content collections)

Each dossier content model (4a–4f) becomes a typed collection. Entries are files; cross-links are slug references in frontmatter; the build resolves them into the curated "where-next" lists.

```
src/content/
  symbols/      [symbol].mdx     ← model 4c ★
  figures/      [figure].mdx     ← model 4a
  pillars/      [slug].mdx        ← model 4b (body = the essay)
  casebook/     [case].mdx        ← model 4d
  timeline/     [node].mdx        ← model 4e
  library/      [source].mdx      ← model 4f
  glossary/     [term].mdx
  pathways/     [slug].mdx        ← ordered list of entry slugs + connective copy
```

**Frontmatter schema — Symbol (the ★ flagship), illustrative:**
```yaml
name: "The All-Seeing Eye"
aka: ["Eye of Providence"]
slug: all-seeing-eye
category: "civic-solar"        # one of the 8 classes
tradition: "Civic-Solar"
era: "Renaissance"
glyph: "./plates/eye.jpg"
one_line: "The few who see, hidden on the money in your pocket."
tier: "B"
decoded_by: [maxwell, hall]    # → figures
related_symbols: [seal, sun-cross]
appears_in: [great-seal-pyramid]   # → casebook
timeline: plato-bans-poets         # → node (if applicable)
sources:
  - {title: "...", author: "...", year: 1928, tier: "B", url: "..."}
# body (MDX) = documented_origin / the reading / modern_appearances (RL-1)
```

**Build resolves the graph:** for each entry, generate reverse links (a figure's page lists every symbol whose `decoded_by` includes them) so cross-references are bidirectional without hand-maintenance. **Where-next** lists are scored (shared category > shared tradition > shared figure) and capped at ~4 — curated-feeling, never exhaustive.

**Media:** plates live beside entries; build emits the duotone treatment (the SVG-filter or pre-baked variants) + responsive sizes + the OG share-card per shareable entry.

---

## 3. COMPONENT BUILD SPECS (the 15-piece kit)

Build these once; every page assembles from them. Each: **props · states · variants · behavior.**

1. **Masthead/Nav** — props: active section. Variants: full / mobile-sheet. Behavior: sticky; Dictionary emphasized; search trigger.
2. **Search (global)** — type-ahead over all collections; routes to `/search`; returns the card system.
3. **Facet bar** — props: facet config per index, active state. Behavior: filters live in-grid, URL-synced (`?cat=solar&tier=A`), never navigates away.
4. **Specimen card ★** — props: symbol. Variants: grid / related / search / pathway-stop. The flagship atom — design first.
5. **Figure card · Casebook card · Source row · Pathway card** — siblings of the specimen card, one system.
6. **Feature block** — the lead story (home, index tops).
7. **Reading-level body** — renders RL-0 (lead) / RL-1 (body) / RL-2 (apparatus+sources) by scroll position; the dual-audience engine.
8. **Source/Tier badge** — A/B/C, quiet; A = asserted, B = "X argues".
9. **Where-next list** — the linkage component; scored, capped, labeled by relation.
10. **Breadcrumb + Prev/Next** — wayfinding + sequential.
11. **Pathway stop** — card + connective copy between stops.
12. **Timeline node** — date · event · why-it-matters · links; pinned-scroll aware.
13. **Entry surface** — two variants: **full page** (`/dictionary/[symbol]`) and **bottom-sheet drawer** (opened from a grid, preserves browse context). Same content, two containers.
14. **Share-card (OG)** — glyph + one line, generated per shareable entry.
15. **States** — skeleton (grid loading), empty/no-results (suggest pathways), 404 (drop onto Start Here).

---

## 4. PAGE ASSEMBLY (route → components)

Each route is a composition of kit pieces over collection data. E.g. `/dictionary` = Masthead + Feature block (curated shelf) + Facet bar + Specimen-card grid + States. `/dictionary/[symbol]` = Masthead + Breadcrumb + Reading-level body (specimen) + Where-next + Share + Prev/Next. (Full route→component table generated at build time from the blueprint's §4.)

---

## 5. SCROLLYTELLING CHOREOGRAPHY ★ (the centerpiece)

**The rule:** motion is a *medium on a few surfaces*, not a coat of paint on all of them. The Timeline earns full scrollytelling; Home and the entry pages earn one or two restrained scroll moments; indexes have none (browsing must stay instant). Google Arts & Culture is the north star: full-bleed imagery, **pinned** sections, **scroll-scrubbed** zoom/parallax, and a calm "where next" hand-off — never motion for its own sake.

**Technique baseline (all set-pieces):** GSAP **ScrollTrigger**, pinned section + a scrubbed timeline driven by scroll progress 0→1 (this is the production version of the rect-polling hack the sandbox forced). `prefers-reduced-motion` → every set-piece degrades to a clean static stack (no pin, no scrub). Mobile uses shorter pins and smaller transforms.

### 5.1 — HOME hero ("the veil parts")
- **Beats:** (0) Flammarion plate full-bleed, thesis line 1 over it. (0.4) scroll scrubs a slow zoom *through* the figure piercing the firmament while line 1 → line 2 crossfade. (0.8) the keystone line lands; plate dims. (1.0) release into the featured decode.
- **Technique:** pin the hero ~150vh; scrub scale 1→1.5 + opacity beats. **Reduced-motion:** static hero, all three lines stacked as a title block.

### 5.2 — START HERE descent (the on-ramp)
- **Five pinned beats**, one per awakening step. Each: a plate locks full-bleed, a single line resolves, a progress tick ("2 of 5") advances; scrolling scrubs the transition (plate cross-dissolve + line swap) into the next.
- **Beat 2 (the decode)** gets a mini version of the Casebook assemble (5.4) — the recognizable logo breaks into its symbols.
- **Reduced-motion:** five stacked full-screen sections with prev/next.

### 5.3 — SYMBOL ENTRY ("the specimen develops")
- One restrained moment: on load/scroll the glyph **resolves** — duotone deepens, the plate settles from a slight scale, the one-line essence types/fades in. Then it's a normal page (RL-1 body, where-next). Browsing must never feel heavy, so this is *seconds*, once.
- **Reduced-motion:** glyph static, copy present.

### 5.4 — CASEBOOK DECODE ("the aha assembles") ★ the conversion moment
- The page's payoff. Beats: (0) the artifact whole (the logo/seal). (scrub) component **symbols lift out** one by one — each highlighted on the artifact, then sliding to a row of specimen-cards with its name. (end) the full **symbol-lineage** is assembled beneath the artifact, each linked to the Dictionary.
- **Technique:** pin the artifact; scrub an overlay timeline that reveals each symbol marker + card in sequence. This is the single most shareable, most "the system works" moment on the site — choreograph it carefully.
- **Reduced-motion:** artifact + a static annotated diagram + the symbol-lineage list.

### 5.5 — THE TIMELINE ★ (the full scroll-story)
- The one page where motion *is* the content. A horizontal-feeling descent through the three acts (sacred image-control → mechanical reproduction & mass persuasion → algorithmic/synthetic imagery).
- **Per node:** a full-bleed plate parallaxes behind; the date + event + "why it matters" resolves as the node enters; scrolling scrubs to the next. **Act transitions** are pinned set-pieces (the ground shifts — antiquity → print → screen → feed → AI).
- **Climax:** the AI-age nodes (2022–2026) — the image-machine privatized — hand off into Pillar P5.
- A **jump rail** (eras) lets the researcher skip the cinematic. **Reduced-motion:** a clean vertical sequence of nodes with the jump rail.

### 5.6 — "WHERE NEXT" hand-off (every detail page)
- Google's "Where next?" pattern: at the foot, the curated links **reveal** on enter (gentle stagger, IntersectionObserver — not a pin). Calm, never a graph. **Reduced-motion:** present, no stagger.

### Motion system constants
- Easing: scroll-scrubbed sections track scroll linearly (no easing — they ARE the scrub); enter-reveals use a soft `cubic-bezier(.2,.7,.2,1)`. Durations on reveals ~0.5–0.7s. No motion on indexes/search. Honor reduced-motion globally. Budget: no set-piece may delay first meaningful paint or block scroll.

---

## 6. PERFORMANCE · RESPONSIVE · A11Y (requirements, not nice-to-haves)

- **Performance:** static HTML first paint; islands hydrate on idle/visible; plates are responsive + lazy below the fold; the duotone is baked or a cheap filter; share-cards pre-generated. Lighthouse ≥ 90 mobile.
- **Responsive:** mobile-first single column; indexes 1–3 cols; detail pages stack; entry = drawer from a grid, full page on direct nav; sticky search; sheet nav. (The phone is the primary test — every prior break was a desktop-tuned layout on a narrow screen.)
- **A11y:** semantic landmarks/headings, focus-visible, alt text on every plate, keyboard-operable facets/drawer/search, reduced-motion fallbacks for all of §5, contrast verified at the palette phase.

---

## 7. THE AGENT BUILD ORCHESTRATION (how Claude Code assembles it)

A driver/orchestrator + focused subagents, each with the project guardrails baked into its brief so output lands pre-aligned (no cleanup pass):

- **Scaffolder** — repo, Astro, collections, tokens placeholder, CI/build.
- **Component agent** — builds the 15-piece kit (§3) against placeholder tokens; Storybook-style preview page.
- **Content-ingest agent** — turns the banked research (.md) + the COPY_INVENTORY outputs into typed MDX entries; validates frontmatter + cross-links.
- **Page-assembly agent** — composes routes (§4) from kit + content.
- **Motion agent** — implements §5 set-pieces with reduced-motion fallbacks; tests responsively (real preview, not one-shot).
- **QA agent** — link/graph integrity, a11y, Lighthouse, **and stance/sourcing compliance** (see guardrails).

**Guardrails every agent inherits** (carry forward to the copy pipeline too): advocacy stance, *in-tradition*, claims **attributed** to proponents (Tier-B "X argues"), Tier-A asserted; **no skeptic/debunk framing, no "rejected by mainstream" hedges** (the research tool kept injecting these — strip at ingest); **antagonist = institutions/power, never ethnicity**; living people described via their *published claims* only; child-safety and general-safety defaults on; fascination, not fear.

**Build sequence (the MVP slice = dossier Phase 2):**
1. Kit + tokens → 2. **Home → Dictionary index → Symbol entry → Casebook decode** (the conversion spine) with 20 symbols / 5 figures / 5 decodes / P1 → 3. Start Here + Timeline v1 → 4. fill to full roster (50 symbols, full lineage/casebook) → 5. search, pathways, library, glossary, SEO/share, growth.

**Acceptance per slice:** renders mobile-first, graph links resolve both ways, reduced-motion verified, stance/sourcing compliant, Lighthouse ≥ 90.
