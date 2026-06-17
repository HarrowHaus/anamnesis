# RUNBOOK — driving Claude Code

Run these phases in order. Each is one focused Claude Code session. Paste the **prompt**, let it work, then do the **verify** before moving on. Claude Code reads `CLAUDE.md` automatically, so you don't re-paste guardrails or context.

> Rule of thumb: keep each session to one phase. If output drifts from the guardrails, say "re-read CLAUDE.md and fix" — don't argue point by point.

---

## Phase 0 — Set up *(no Claude Code yet)*
1. Put this folder on your PC.
2. In the folder: `git init` → commit everything → create a new empty GitHub repo → push.
3. Open Claude Code in this folder.

**Verify:** the repo is on GitHub and Claude Code can see the files.

---

## Phase 1 — Scaffold
**Paste:**
> Read `CLAUDE.md` and everything in `docs/`. Scaffold an Astro project in this repo. Create the content collections defined in `docs/02_BUILD_HANDOFF.md §2` (symbols, figures, pillars, casebook, timeline, library, glossary, pathways) with typed frontmatter schemas. Add a `tokens.css` with neutral placeholder design tokens (no final palette). Do **not** build pages or components yet. Show me the folder structure and the schemas.

**Verify:** `npm run dev` starts; collections + schemas exist; no real pages yet.

---

## Phase 2 — The component kit
**Paste:**
> Build the 15-component kit from `docs/02_BUILD_HANDOFF.md §3`, mobile-first, against the real entries in `content-demo/`. Use only the placeholder tokens. Make a `/_preview` page that renders every component with the demo data so I can see them. Reduced-motion safe. No final colors.

**Verify (on your phone):** every component renders with the demo content; nothing depends on a specific color.

---

## Phase 3 — The conversion spine
**Paste:**
> Build the conversion-spine pages using the component kit and the `content-demo/` entries: the **Home** page, the **Dictionary index** (faceted browse), the **Symbol entry** page, and one **Casebook decode** page. Follow the layouts in `docs/01_BLUEPRINT.md §4`. Mobile-first. The entry should work both as a full page and as a bottom-sheet drawer from the grid.

**Verify (phone):** you can browse the dictionary, filter it, open a symbol, and read it. It should feel like a publication, not a homepage.

---

## Phase 4 — The motion moment
**Paste:**
> Implement the **Casebook "aha assembles"** scroll set-piece from `docs/02_BUILD_HANDOFF.md §5.4` with GSAP ScrollTrigger — the artifact pins and its component symbols lift out into a symbol-lineage. Include the `prefers-reduced-motion` fallback (static annotated diagram). Test it responsively in a real preview.

**Verify (phone + reduced-motion on):** the decode assembles on scroll, and degrades cleanly to static.

---

## Phase 5 — Wire the writing pipeline
**Paste:**
> Using `prompts/gen-symbol.md` and `research/SYMBOL_DICTIONARY.md`, generate the next **10 symbol entries** as MDX into `src/content/symbols/`, each passing the compliance self-check in the prompt. Then create `prompts/gen-figure.md` by adapting `gen-symbol.md` to the figure schema in `docs/03_COPY_INVENTORY.md §2D`, and generate **5 figure profiles** from `research/LINEAGE_PROFILES.md`.

**Verify:** new entries render in the dictionary; spot-check that Tier-B claims are attributed and nothing reads like a debunk.

---

## Phase 6 — Expand
**Paste (one at a time, as needed):**
> Build the **Start Here** on-ramp (`docs/01 §4`, motion per `docs/02 §5.2`).
> Build the **Timeline** scroll-story (`docs/02 §5.5`) from `research/TIMELINE.md`.
> Add global **search** + facet results.
> Generate the remaining roster via the prompt-pack (write `gen-casebook`, `gen-pillar`, `gen-timeline`, `gen-library`, `gen-glossary`, `gen-pathway`, `gen-seo` as variations of `gen-symbol`, in the order in `docs/03 §3`).

**Verify each on your phone before the next.** Stop and lock the palette (a separate design phase) before scaling to the full content roster.

---

### If something feels "vibe-coded / just sitting there"
That's almost always the layout being built against thin content. Make sure it's building against real `content-demo/` entries, and point it at the specific blueprint section for that page. The structure is in `docs/` — make it follow the structure, not its instincts.
