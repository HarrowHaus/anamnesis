# ANAMNESIS — COPY INVENTORY & GENERATION PLAN (v1)

*You won't write the site. At most you'll have Claude write the prompts that make Claude write it (later, API workers; for now, in-chat / Claude Code). So this document is two things: (1) a **complete inventory** of every piece of prose the finished site needs, and (2) the **generation system** — the prompt machinery — that produces it, pre-aligned to the stance so nothing needs hand-cleaning.*

*Everything here is **fed by the banked research** (LINEAGE / SYMBOL_DICTIONARY / TIMELINE / CASEBOOK / PILLAR_SOURCES / LIBRARY / GLOSSARY). The research holds the facts; this layer turns facts into the site's written voice.*

---

## 1. INHERITED VOICE & GUARDRAILS (every generation prompt carries this)

Non-negotiable constitution stamped into every copy prompt:

- **Stance:** advocacy, in-tradition, the believer's case at full strength. **No debunk, no skeptic hedges, no "rejected by mainstream scholarship," no reception/criticism layer.** (The research tool injected these; the copy layer must never reintroduce them.)
- **Sourcing tiers:** Tier-A (hard history/scholarship) stated as fact; **Tier-B (proponents) always attributed** — "Maxwell reads…", "Tsarion argues…", never asserted as settled. Tier-C sparingly.
- **Antagonist = institutions / power structures, never ethnicity.** No ethnic, racial, or "reptilian"-type framing, ever.
- **Living people:** describe their *published claims and stated work* only; attribute everything; no defamatory factual assertions about individuals.
- **Voice:** lucid, confident, initiatory; "you" (waking) + "we" (those who see), sparingly; short declarative image-first sentences; lead with the hook, then the proof. **Fascination, not fear.** No ALL-CAPS crank energy, no "they don't want you to know" filler.
- **Reading level:** RL-0/RL-1 accessible to a curious newcomer; depth + sources at RL-2.
- **Safety:** general content-safety defaults on; nothing targeting or sexualizing minors; nothing operational/harmful.

---

## 2. THE COPY INVENTORY (every slot the site needs)

Counts use the banked roster. **Prose fields** = what must be *written*; structured data (dates, links, tiers, categories) comes straight from research and isn't "copy."

### A. Global UI / chrome  *(~45 strings, written once)*
Nav labels (8 sections + Start Here) · search placeholder + type-ahead empty/hint · button labels (Read it, Open the symbol, Browse all, Share, Where next, Close) · facet-group labels + filter chip labels · result-count templates · **empty / no-results / 404 / loading** copy · footer (sitemap labels, tagline, sourcing one-liner) · tier-badge labels + their tooltips · share-card CTA. *Fed by: this doc + voice guide.*

### B. Home  *(~12 slots)*
The hook (1–2 oversized lines) · featured-decode blurb (≤25w) · 3–4 pathway titles + one-line blurbs · dictionary-shelf framing line · P1 teaser (≤40w) + link label. *Fed by: pillars + casebook.*

### C. Start Here  *(5 beats × 2 = ~10 slots + close)*
Per step: a headline (≤10w) + body beat (40–70w). Steps: the claim · one decode · the keystone (Plato) · the pattern (war on images) · "now you can't unsee it." *Fed by: P1, P2, a lead casebook entry.*

### D. PER-ENTRY CONTENT — the bulk

| Type | Count | Prose fields to write (per entry) | Budget/entry | Fed by |
|---|---|---|---|---|
| **Symbol** ★ | ~50 | one_line (≤14w) · documented_origin (60–90w) · the_reading (60–90w, attributed) · modern_appearances (40–70w) · share_line (≤14w) | ~250w | SYMBOL_DICTIONARY_v1 |
| **Figure** | ~28–40 | one_line (≤14w) · role_in_lineage (1 line) · core_claims (3–6 × ~20w) · signature_examples (2–3 × ~25w) · status_note (1–2 sent.) | ~300w | LINEAGE_PROFILES_v1 |
| **Pillar essay** | 5 | the long-read essay · thesis paragraph · 2–3 pull-quotes · anchor/proponent framing | 800–1,400w each | PILLAR_SOURCES_v1 (+ research) |
| **Casebook decode** | ~15–17 | surface (30–50w) · the_decode (60–90w, attributed) · symbol_lineage narrative (1 line × symbols used) · who_made_claim (1 line) · share_line (≤14w) | ~250w | CASEBOOK_v1 |
| **Timeline node** | 26 | event (1 line) · why_it_matters (30–50w, image-control angle) | ~60w | TIMELINE_v1 |
| **Library source** | ~23 | summary (30–50w) · used-by framing (auto from graph) | ~45w | LIBRARY_v1 |
| **Glossary term** | 61 | definition (25–45w, stance-aligned) | ~35w | GLOSSARY_v1 |
| **Pathway** | ~6 | title · intro (40–60w) · connective copy between stops (~4 × ~25w) | ~160w | authored (curates existing entries) |

### E. Meta / SEO / Share  *(~3 strings × every page ≈ 600+ strings)*
Per page (≈210 pages: ~50 symbols + ~35 figures + 5 pillars + 17 casebook + 26 timeline + 23 library + 61 glossary + indexes + statics): **SEO title** (≤60 char) · **meta description** (≤155 char) · **OG/share line**. Generated *from* each entry's copy, last. High-leverage: the symbol + casebook entries are the spread engine.

### F. About / Method + legal  *(~6 blocks)*
Mission · the method (how entries are built) · the sourcing-standard explainer (the tier system, plainly) · the posture ("what we are / are not" — institutions not ethnicity) · the living-persons/attribution note · image-rights/fair-use note. ~700–1,000w total. *Fed by: dossier §1, §11, §15.*

### SCALE TALLY
Roughly **~1,900–2,300 discrete copy slots** + **5 long-form essays** + **~210 SEO/share triples**. This is why it's a generation pipeline, not a writing task — and why the prompts must be pre-aligned so output drops straight into MDX.

---

## 3. THE GENERATION SYSTEM ("Claude writes prompts for Claude")

**The pattern.** For each content type, one **master generator prompt** = the constitution (§1) + the schema (the fields + budgets from §2D) + the matching **research file as input** + 1–2 gold-standard examples. Run it **once per entry**; it returns ready-to-drop **MDX with frontmatter + RL-1 body**. The research file is the source of truth; the prompt is the voice + format transformer.

**The prompt-pack (the templates to write — this is the "Claude writes prompts" step):**
1. `gen-symbol.md` ★ — symbol entries (highest volume + highest value; build & perfect this first).
2. `gen-figure.md` — figure profiles.
3. `gen-pillar.md` — the 5 long-reads (most editorial; may run per-section).
4. `gen-casebook.md` — decodes (incl. the symbol-lineage breakdown).
5. `gen-timeline.md` — nodes (batchable — all 26 in one structured pass).
6. `gen-library.md` + `gen-glossary.md` — batchable utilities.
7. `gen-pathway.md` — authored journeys over existing entries.
8. `gen-ui.md` — the global chrome strings (one pass).
9. `gen-seo.md` — title/meta/OG, run **last**, fed each finished entry.

**Sequencing (dependency order):**
`symbols + figures` first (everything references them) → `casebook` (references symbols/figures) → `pillars` (embed casebook/symbols as evidence) → `timeline + library + glossary` (batch) → `pathways` (curate finished entries) → `home + start-here` (curate the best) → `UI + About` → `SEO/share` (from finished copy). This mirrors the build slice in the HANDOFF.

**QA / compliance loop (the "pre-cleaned" guarantee).** A `review-compliance.md` prompt runs over every generated entry and flags: any skeptic/debunk phrasing, unattributed Tier-B claims, ethnic/violent framing, unsourced assertions, voice drift (crank energy / fear filler), or RL-leveling errors. Fix-or-flag before merge. This is the guardrail that stops the contamination that plagued the research phase.

**Now vs. later (same prompts, different runner).** Today these run **in-chat or in Claude Code** (paste research file → run generator → drop output), batchable a dozen entries at a time. When you stand up **API workers**, the identical prompt-pack becomes the worker instruction set — a script iterates the roster, calls the generator per entry, runs the compliance review, commits the MDX. Nothing about the prompts changes; only the runner. So building the pack now is not throwaway — it *is* the eventual workers' brain.

---

## 4. NEXT ACTION

The highest-leverage move is to **draft `gen-symbol.md` — the flagship generator — in full** (constitution + schema + budgets + two gold-standard worked examples), then run it on 2–3 real symbols from the banked dictionary so you can see finished, drop-in entry copy and approve the voice. Once that template is locked, the other eight are variations on it, and the whole copy layer becomes a turn-the-crank operation.

*Say the word and I'll write `gen-symbol.md` and demo it on three symbols.*
