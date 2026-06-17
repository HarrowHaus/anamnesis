# CLAUDE.md — ANAMNESIS *(working title; name under review)*

You are building **ANAMNESIS**: an advocacy compendium website that teaches a symbolically-illiterate public to *read* the engineered symbols steering them — tracing the war over images from Plato to the AI age. It must feel like a **designed editorial publication** (Public Domain Review × Atlas Obscura × Are.na), never a wiki and never a graph explorer. One site that quietly serves two readers — a curious wanderer and an expert — without ever telling either which one they are.

## Read these first
- `docs/00_DOSSIER.md` — project spine: thesis, IA, content models, pillars, sourcing standard, voice.
- `docs/01_BLUEPRINT.md` — full site architecture & UX: every page, nav layer, layout.
- `docs/02_BUILD_HANDOFF.md` — stack, data-model→files, the 15-component kit, **scrollytelling choreography**, build sequence.
- `docs/03_COPY_INVENTORY.md` — every copy slot + the generation system.
- `docs/04_DESIGN_REFERENCES.md` — the 14 reference sites + patterns.
- `research/` — the banked **facts** that feed all written content (source of truth).
- `content-demo/` — three **finished** symbol entries. Build the UI against these (real content, never placeholder lorem).
- `prompts/` — the copy-generation prompt-pack.
- `assets/plates/` — seed public-domain plates (grayscale, duotone-ready).

## Non-negotiable guardrails (apply to every file, every line of copy, every commit)
- **Stance:** advocacy, in-tradition, the believer's case at full strength. **NO** debunk, **NO** skeptic hedges, **NO** "rejected by mainstream," **NO** criticism/reception layer.
- **Sourcing:** Tier-A (hard history/scholarship) stated as fact; **Tier-B (proponents) ALWAYS attributed** ("Maxwell reads…", "Tsarion argues…"); Tier-C sparingly.
- **Antagonist = institutions / power structures, NEVER ethnicity.** No ethnic, racial, or "reptilian" framing, ever.
- **Living people:** describe their *published claims and work* only; attribute everything.
- **Voice:** lucid, confident, fascination not fear; short declarative image-first sentences; lead with the hook. No crank / ALL-CAPS energy, no "they don't want you to know" filler.
- **Safety:** standard content-safety defaults; nothing targeting or sexualizing minors; nothing operationally harmful.

## Stack
**Astro + content collections (MDX)** · island hydration for search / facets / entry-drawer / scrollytelling · **GSAP ScrollTrigger** for motion · CSS design tokens · static output. The relational graph (symbol ↔ figure ↔ casebook ↔ source) resolves from **frontmatter cross-references at build** — no database. **Mobile-first.** **Reduced-motion fallbacks required** for every motion set-piece.

## Build sequence (in order; verify each on a phone before the next)
0. Scaffold Astro + the content collections in `docs/02 §2` + placeholder design tokens.
1. Design tokens + the **15-component kit** (`docs/02 §3`) — built **against `content-demo/`**.
2. The **conversion spine**: Home → Dictionary index → Symbol entry → Casebook decode.
3. One motion set-piece: the **Casebook "aha assembles"** (`docs/02 §5.4`).
4. Wire the copy **prompt-pack** (`prompts/`) to generate remaining entries into the collections.
5. Expand: Start Here, Timeline, full roster, search, pathways, library, glossary, SEO/share.

## Acceptance (every slice)
Renders mobile-first · graph links resolve both ways · reduced-motion verified · stance/sourcing compliant · Lighthouse ≥ 90 mobile.

## Palette (NOT yet locked — do not invent one)
Build with **neutral, swappable placeholder tokens**. The duotone/skin becomes a per-section **wayfinding** system in a later phase. Keep all color in tokens so it can be replaced without touching components.
