# ANAMNESIS — SITE ARCHITECTURE & UX BLUEPRINT (v1)

*The whole site, conceived before the skin. This defines every page, every navigation layer, every layout, and the UX that connects them. Duotone, palette, and the chosen body (broadsheet / D-lineage / etc.) are applied **on top of this** in the next phase — they are deliberately absent here.*

---

## 0. THE GAP — what the mockups were missing

Everything built so far (A–H) is, structurally, **one page**: a curated front + a faceted browse + an entry drawer, re-skinned. That's maybe 20% of the site the dossier describes. Held against the dossier's 8-section IA and the 14 reference sites, here's what's absent:

**Missing pages / surfaces**
- **Start Here** — the 5-step initiate on-ramp. The single most important page for converting a wanderer, and it doesn't exist yet.
- **Pillar long-reads** — the five spine essays (P1–P5). These are *articles*, not cards.
- **Lineage** — figure profiles + the transmission/influence map (rendered as a list, not a graph).
- **The Timeline** — Plato → AI age, as an experience.
- **The Casebook** — worked decodes of recognizable logos/buildings/ads. The dossier calls this *the gateway drug* — the most shareable, skeptic-converting surface — and it's the one I've leaned on least.
- **Library** and **Glossary** — the utility indexes.
- **Pathways / Collections** — guided themed journeys that cut *across* the taxonomy (Wellcome's "Pathways," Atlas Obscura's "Hubs").
- **Search results**, **facet/tag results**, **About / Method**, **share-cards**, and all **system states** (empty, loading, no-results, 404).

**Missing navigation layers** — we have global-ish nav + facets + threads. We're missing: the guided **on-ramp** layer, the cross-taxonomy **pathways** layer, **search-as-browse**, **lateral/sequential** nav (prev/next within a pillar series, pathway, or timeline), **wayfinding** (breadcrumbs / "you are here" / section identity), and the full **cross-type linkage** (a symbol → the casebook entries it appears in → the figures who decoded it → its source tier).

**Missing UX systems** — the **reading-level mechanism** (lead → essay → apparatus, the dual-audience engine), the **specimen-card system** for symbols, the **sourcing/credibility display** (tier badges, quiet), **share/spread mechanics** (the symbol entries are designed to travel), and **responsive/empty/loading** behavior.

The blueprint below fills all of it.

---

## 1. THE ONE PRINCIPLE EVERYTHING SERVES

**One publication that quietly serves two readers, and never tells either which one they are.**

- The **wanderer** experiences a beautifully structured magazine: a front door, featured pieces, themed collections, recognizable decodes. Guided — but it never says "guided."
- The **initiated** reaches the granular layer — faceted indexes, cross-links, sources, the full archive — without a "mode," just by reaching for it (nav, search, scrolling deeper, following threads).
- **Depth is layered, never gated.** Every entry opens with a one-line hook anyone can read, and descends into essay → apparatus → sources. The curious newcomer stops where they like; the researcher keeps going.
- **The relational graph is plumbing.** It surfaces only as calm curated lists — "where next," "decoded by," "appears in," "related symbols" — never a node-graph. (Dossier §3; Are.na's pattern.)
- **Voice:** lucid, confident, fascination over fear. Sourcing is visible but quiet — credibility is the whole moat.

Every decision below is downstream of this.

---

## 2. THE NAVIGATION LAYERS (all of them)

The site runs nine distinct navigation layers. Most pages use three or four at once.

**L1 — Global masthead (persistent).** Wordmark · the primary destinations · search. The **Dictionary** carries visual primacy (it's the flagship). Collapses to a sheet menu on mobile. Always offers: home, the section indexes, search.

**L2 — The On-Ramp (Start Here).** The loudest single call for a first-time visitor. A guided, linear, 5-step awakening. Not in the main nav row's crowd — given its own prominent, recurring entry point (a fixed "Start Here" affordance on home and in the menu).

**L3 — Pathways / Collections.** Curated, themed journeys that cross the taxonomy ("Follow the Eye," "The Sky-Code in five plates," "How persuasion was built," "Logos hiding in plain sight"). This is the *invisible guidance* layer — it reads as editorial features, not "beginner mode." (Wellcome Pathways; Atlas Hubs.)

**L4 — Faceted browse (in-index).** Inside each index — Dictionary, Lineage, Casebook, Library — live filters operate *in the grid*, never switching to a separate "search mode." Filter dimensions per index (see §6). (Cooper Hewitt; Letterform instant-filter.)

**L5 — Global search.** Search-as-browse: a single field that suggests as you type and returns a unified, filterable result set across all content types. Reachable from every page.

**L6 — The linkage layer (in-entry).** The graph, surfaced as lists at the foot of every detail page: *Where next*, *Related symbols*, *Decoded by*, *Appears in*, *Sources*. Calm, hand-feeling, never exhaustive. (Are.na "connected 190×" as a list.)

**L7 — Lateral / sequential.** Prev ⇄ next within an ordered context: the 5 Start-Here steps, a Pillar series, a Pathway's stops, Timeline nodes. Shows progress ("3 of 5").

**L8 — Wayfinding.** Breadcrumb / "you are here" + per-section identity (each section gets a quiet visual signature — assigned in the palette phase) so the reader always knows which of the eight rooms they're in and how to get back.

**L9 — Footer.** The full sitemap, About/Method, sourcing standard, and quiet utilities — the safety net for anyone who scrolled to the bottom looking for structure.

---

## 3. THE PAGE INVENTORY (full sitemap)

```
A. ENTRY & ON-RAMP
   /                      Home — thesis, hook, the curated front door
   /start                 Start Here — the 5-step initiate descent

B. SECTION INDEXES (browsable hubs)
   /dictionary  ★         Symbol Dictionary index — the flagship specimen wall
   /lineage               The Lineage index — founders / ancestors / peers / backbone
   /pillars               The Pillars index — the five spine essays
   /casebook              The Casebook index — worked decodes (the viral surface)
   /timeline              The Timeline — Plato → the AI age
   /library               The Library — primary sources, books, lectures, films
   /glossary              The Glossary — every term, defined

C. DETAIL PAGES (the content models)
   /dictionary/[symbol] ★ Symbol entry — the "specimen" detail (core product)
   /lineage/[figure]      Figure profile — who they are + transmission links
   /pillars/[slug]        Pillar essay — long-read with embedded examples
   /casebook/[case]       Casebook decode — surface → decode → symbol-lineage
   /library/[source]      Source page — one book/lecture/film + where it's used

D. CROSS-CUTTING
   /pathways/[slug]       Pathway / Collection — a guided themed journey
   /search                Search results — unified, filterable
   /t/[facet]             Facet/tag results (e.g., all "solar" symbols, all Tier-A)
   /about                 About / Method — mission, sourcing standard, posture

E. SYSTEM
   404 / empty / no-results · loading skeletons · share-card (OG image)
```

**Cross-type relations (the graph, as lists).** A **Symbol** links to: its Pillar, its Timeline moment, the Figures who decoded it, the Casebook entries it appears in, related Symbols, its Sources. A **Figure** links to: their Pillars, signature Symbols, Casebook decodes, Library works, who they influenced / were influenced by. A **Casebook** decode links to: the Symbols it uses (traced to the Dictionary), the Figure who made the claim, Sources. Every page is a hub; the reader only ever sees curated lists.

---

## 4. PAGE-BY-PAGE — LAYOUT + UX

Each page below is described as a vertical stack (mobile-first; wider screens add columns). "RL" = reading level.

### HOME `/`
*Purpose: state the thesis, hook the wanderer, open all paths without looking like an index.*
- **Masthead** (L1) + a quiet, persistent **Start Here** affordance (L2).
- **The hook** — the thesis in one or two oversized lines + the keystone plate. One sentence, not a paragraph. ("You were taught to look. You were never taught to read.")
- **Featured decode** — a single recognizable Casebook entry (the dollar, the CBS eye) as the lead story. *This is the conversion bait* — a logo you know, suddenly legible.
- **Pathways strip** (L3) — 3–4 themed journeys as editorial cards.
- **From the Dictionary** — a small curated set of specimen cards → into the flagship.
- **The argument, briefly** — a short Pillar teaser (P1) with a "read the pillar" link.
- **Footer** (L9).
- *UX:* nothing announces curation; it reads as a magazine homepage. Every block is a doorway. No facets here — this page never asks the wanderer to filter.

### START HERE `/start`
*Purpose: the on-ramp. Convert a passive viewer into someone who looks. The dossier's INITIATE track, made literal.*
- A **single guided descent of 5 steps**, sequential (L7), each a full screen-beat:
  1. **The claim** — representation is power (the hook).
  2. **One stunning decode** — a recognizable logo read end-to-end (borrow a Casebook entry).
  3. **The keystone** — Plato banned the poets (P1, condensed).
  4. **The pattern** — the war on images across four millennia (P2, condensed — the credibility ballast).
  5. **Now you can't unsee it** — hands off into the Dictionary + Pathways.
- Progress indicator ("2 of 5"), prev/next, and an always-available "skip into the archive."
- *UX:* this is the one place guidance is overt — but framed as an *experience*, not a tutorial. Ends by releasing the reader into L3/L4, not a dead end.

### SYMBOL DICTIONARY — INDEX `/dictionary` ★
*Purpose: the flagship. The most useful, most re-visited, most shareable surface. Browse by sight.*
- **Index masthead** — title + live **search** (L5) + result count.
- **Faceted browse** (L4): filter by **category** (solar/astro · sacred-geometry · alchemical · masonic · corporate · civic · religious · occult), and secondarily by tradition / era / source-tier. Filters act live in the grid; the grid never switches to a "search page."
- **The specimen wall** — image-forward cards, each: the glyph (duotone plate), the name, a one-line teaser, its category. (Cards = the reusable "specimen" component, §7.) Varied-density gallery hang is an option here (the WALL skeleton can live *inside* this index).
- Optional **curated shelves** at the top ("most decoded," "hiding in your wallet") before the raw grid — invisible guidance.
- *UX:* enter by sight or by filter, never by knowing the vocabulary. Empty-filter state suggests loosening. This is where Cooper Hewitt's "search that doubles as browse" lives.

### SYMBOL ENTRY `/dictionary/[symbol]` ★
*Purpose: the core product. The specimen detail. Layered so a newcomer and a researcher both leave satisfied.*
- **Specimen hero** — the glyph large (duotone), name, category, one-line essence. (RL-0: anyone.)
- **Documented origin** — the real, sourced history. (RL-1.)
- **The reading** — the tradition's esoteric interpretation, *attributed* ("Maxwell reads…"). (RL-1.)
- **Where it hides today** — modern appearances: logos, architecture, media. (RL-1, the "aha".)
- **Apparatus** (RL-2, quiet, below the fold): catalog (category · tradition · era · source-tier · decoded-by) + **Sources** with tier badges.
- **The linkage foot** (L6): *Related symbols · Decoded by [figures] · Appears in [casebook] · On the timeline · Where next.* Calm curated lists.
- **Share** — a built share-card (the glyph + one line) — this entry is designed to travel.
- *UX:* the spine of the dual-audience model. RL-0/1 reads like a magazine; RL-2 is there for those who reach. Ends in curated onward motion, never a graph.

### PILLAR ESSAY `/pillars/[slug]`
*Purpose: the spine argument as a designed long-read (The Pudding / Public Domain Review essay).*
- **Essay hero** — pillar number, title, thesis sentence, a defining plate.
- **The argument** — a real article: short declarative paragraphs, image-first, **inline examples** that pull from the Casebook and Dictionary (a logo decode dropped mid-argument as evidence).
- **Anchors & proponents** — the citable spine (Tier-A history) named; the proponents (Tier-B) attributed.
- **Linkage foot** (L6) + **prev/next across the five pillars** (L7).
- *UX:* this is where P2 (the war on images) does its credibility work and P4 (engineering of consent) makes the skeptic nod. Reading-level: accessible top, sources at the foot.

### LINEAGE — INDEX `/lineage`
*Purpose: the people, organized by their role in the transmission.*
- **Tiered browse**: Founders · Ancestors · Peers · Scholarly Backbone (the dossier's four tiers), each a row/section of **figure cards** (portrait/plate, name, dates, one-line).
- Live filter by tier / era / tradition (L4).
- A quiet **transmission line** up top — the chain Dupuis → Volney → Higgins → Massey → Kuhn → Maxwell → Tsarion/Bonacci/Freeman — rendered as an editorial *list/flow*, **not a graph**.
- *UX:* the backbone tier is the "secret weapon" (academy confirms the core) — surface it with equal weight to lend credibility.

### FIGURE PROFILE `/lineage/[figure]`
*Purpose: who they are + how they connect (Figure Profile model 4a).*
- **Hero** — portrait/plate, name (+ aka), dates, tier, one-line.
- **Core claims** (3–6, RL-1) · **key works** (linked → Library) · **signature decodes** (linked → Casebook/Dictionary).
- **Influence** (L6, as lists): *Influenced by →* / *Influenced →* (figures), plus *Pillars*, *Symbols*, *Sources*. Never a node-graph.
- **Status note** (living/active, where the archive lives) — and the legal posture (attributed claims only).
- *UX:* every claim is a doorway into the symbols/casebook; the profile is a hub, not a dead biography.

### CASEBOOK — INDEX `/casebook`
*Purpose: the gateway drug. Recognizable artifacts, suddenly legible. The most shareable surface.*
- **Browse by artifact type**: corporate logos · civic architecture · money & seals · film/music ritual · advertising.
- **Decode cards** — the artifact (logo/building/ad) + a one-line "what it really says." Built to be screenshot and shared.
- Lead with the **most documented symbol-lineage** entries (they convert skeptics fastest).
- *UX:* this is the front line of conversion — design for the screenshot. Filter live (L4).

### CASEBOOK DECODE `/casebook/[case]`
*Purpose: a single worked decode (model 4d) — the most satisfying page type.*
- **The artifact** — large.
- **The surface** — what the public sees. (RL-0.)
- **The decode** — the reading, attributed. (RL-1.)
- **Symbol-lineage** — *this is the magic*: the artifact broken into its component Dictionary symbols, each linked back, traced to origin. (L6.)
- **Who made this claim** (figure link) + **Sources** (RL-2).
- **Share-card** + where-next.
- *UX:* the symbol-lineage section is the proof-of-system — it shows the Dictionary "working." Highest share priority.

### TIMELINE `/timeline`
*Purpose: the war over images across ~45,000 years → 2026, as an experience (The Pudding scrollytelling).*
- A **vertical scroll-story** through the three acts (sacred image-control → mechanical reproduction & mass persuasion → algorithmic/synthetic imagery), one node per beat.
- Each **node** (model 4e): date/era, event, *why it matters* (image-control angle), linked figures/symbols.
- A compact **jump-nav / era rail** for the researcher who wants to skip.
- *UX:* the only page where motion is the medium (built for real in production); statically it degrades to a clean vertical sequence. Ends in the AI-age node → P5.

### LIBRARY `/library` + SOURCE `/library/[source]`
*Purpose: the bibliography — credibility made browsable (model 4f).*
- **Index:** filter by type (book/lecture/film/article) and **tier** (A/B/C); each row: title, author, year, tier badge, one-line, "used by" count.
- **Source page:** the work + summary + **where it's used across the site** (L6) + external link.
- *UX:* the Library is the moat — it proves the site is sourced, not shouted. Tier badges everywhere, quiet.

### GLOSSARY `/glossary`
*Purpose: every term, defined; an A–Z utility.*
- Jump-to-letter rail + live filter; each term: definition + links to where it's used.

### PATHWAY / COLLECTION `/pathways/[slug]`
*Purpose: a guided themed journey across the taxonomy (Wellcome Pathways) — the invisible-guidance layer made into a page.*
- **Pathway hero** — title, a sentence, the number of stops.
- **Ordered stops** (L7) — each a card → entry, with a line of connective editorial between them ("…which leads to…").
- *UX:* this is how a wanderer gets a curated route without being told they're a beginner. Pathways are *authored*, not algorithmic.

### SEARCH `/search`
*Purpose: search-as-browse across everything (L5).*
- A unified result set (symbols, figures, pillars, decodes, sources), **filterable by type** in the result grid, with the same card system.
- Type-ahead suggestions; a useful **no-results** state (suggested pathways / popular entries).

### ABOUT / METHOD `/about`
*Purpose: mission, the sourcing standard (the tier system explained), the posture (institutions not ethnicity; attribution for living people), and what the site is / is not.*
- *UX:* this page is the credibility contract. It earns the right to make the rest of the claims.

---

## 5. CROSS-CUTTING UX SYSTEMS

- **Reading levels (the dual-audience engine).** Every detail page is authored in three layers: **RL-0** one-line essence (everyone) · **RL-1** the body (origin / reading / modern) · **RL-2** apparatus + sources (the researcher). Layered by position (scroll depth), not by a toggle. This is what lets one page satisfy both readers.
- **The specimen-card system.** One card component for symbols, reused in the Dictionary grid, in "related," in search, in pathways, in share-cards. Consistency = "publication, not database" (pattern #7). Figure-cards and casebook-cards are sibling components.
- **The where-next system.** Every detail page *ends* in a small, hand-feeling curated list (max ~4 items), chosen for relevance, never the full graph. The reader always has a next move; the next move always feels chosen.
- **Search & facets.** Shared taxonomy: **category** (8 symbol classes) · **tradition** · **era** · **source-tier**. Facets filter live in-grid (L4); search is global (L5); both render the same card system. No mode switches.
- **Sourcing & credibility display.** Tier badges (A/B/C) appear on entries and sources, quietly. Tier-A stated as fact; Tier-B always "X argues…". The Library is the backbone. This is the un-cancellable moat.
- **Share / spread.** Symbol and Casebook entries generate share-cards (glyph + one line). The growth engine is the screenshot; design every specimen/decode for it.
- **Wayfinding & section identity.** Breadcrumb + "you are here"; each of the 8 sections gets a quiet visual signature (assigned in the palette phase — this is where duotone earns its keep).
- **States.** No-results → suggest pathways/popular. Empty filter → "loosen a filter." Loading → skeleton cards (never a spinner on a grid). 404 → drop them onto Start Here or the Dictionary.
- **Responsive.** Mobile-first single column; indexes reflow to one/two columns; detail pages stack; entry can be a full page *or* a bottom-sheet drawer when opened from a grid (keeps browse context). Sticky search; sheet menu for nav.
- **Accessibility.** Real headings/landmarks, focus states, alt text on plates, reduced-motion fallback for the Timeline, contrast verified at the palette phase.

---

## 6. THE COMPONENT INVENTORY (the system to design once, reuse everywhere)

This is the "Sol/MoMA component kit" (pattern #7). Design the palette/skin against *these*, not against pages:

1. **Masthead / nav** (+ mobile sheet)
2. **Search field** (global) + **type-ahead**
3. **Facet bar** (live, in-grid)
4. **Specimen card** (symbol) ★ · **Figure card** · **Casebook card** · **Source row** · **Pathway card**
5. **Feature block** (the lead story)
6. **Reading-level body** (RL-0/1/2 sections)
7. **Source / tier badge**
8. **Where-next list** (the linkage component)
9. **Breadcrumb** + **prev/next** (sequential)
10. **Pathway stop** (with connective copy)
11. **Timeline node**
12. **Entry surface** (full page *and* bottom-sheet drawer variants)
13. **Share-card** (OG)
14. **Footer / sitemap**
15. **States**: skeleton, empty, no-results, 404

Build these 15 well and every one of the ~14 page types assembles from them.

---

## 7. WHAT'S NEXT (the palette phase you flagged)

With this locked, the skin work becomes *systematic instead of decorative*:
1. Pick the **body** (the broadsheet F voice you liked, or a refinement of it) and apply it to the **component kit** (§6), not to pages.
2. Assign the **duotone palette** as a **wayfinding system** — each of the 8 sections gets a signature treatment (e.g., Dictionary / Lineage / Casebook / Timeline each read distinctly), so color does navigational work, not just decoration.
3. Resolve the **specimen-card** treatment first (it's the most-reused, highest-leverage component and the flagship's atom).
4. Then assemble: Home → Dictionary index → Symbol entry → Casebook decode (the conversion spine) as the first real build slice, exactly the dossier's Phase-2 MVP.

*Skin serves structure. Now there's a structure for it to serve.*
