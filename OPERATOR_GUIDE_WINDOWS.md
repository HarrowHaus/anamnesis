# ANAMNESIS — Windows Operator Guide

Everything you need to build the site with the **Claude Code desktop app** on Windows, start to finish. You don't write code. You run setup once, then drive the build by pasting the prompts below and checking the result on your phone.

**Your repo lives at:** `c:\changers\anamnesis`
**You are using:** the Claude Code desktop app on Windows.

---

## Part 0 — The shape of the whole thing
1. Install four things (once).
2. Put this folder at `c:\changers\anamnesis` and push it to GitHub (once).
3. Open the folder in Claude Code.
4. Paste the build prompts in order (Part 4). Check each on your phone.
5. Turn on the writing machine to fill the site with entries (Part 5).
6. Add imagery (Part 6) and lock the palette (Part 7) when the structure is solid.

The automation (auto-checking every file, a writer agent, a quality-checker agent) is already wired into this folder. You don't set it up — it just runs.

---

## Part 1 — Install these four things (one time)

1. **Node.js (LTS).** Download from <https://nodejs.org> → run the installer → accept defaults.
   *Check it worked:* open the **Start menu → type "PowerShell" → Enter**, then type `node --version`. You should see a version number.
2. **Git.** Download from <https://git-scm.com/download/win> → run installer → accept defaults.
   *Check:* in PowerShell, `git --version`.
3. **Claude Code desktop app.** Install from <https://www.claude.com/product/claude-code>. Sign in with your Claude account.
4. **A GitHub account.** Sign up at <https://github.com> if you don't have one.

---

## Part 2 — One-time setup

1. **Place the folder.** Unzip the handoff so the files sit directly at `c:\changers\anamnesis` (you should see `CLAUDE.md`, `docs`, `research`, etc. inside that folder — not a second nested folder).

2. **Open a terminal there.** In File Explorer, go into `c:\changers\anamnesis`, click the address bar, type `powershell`, and press Enter. A blue window opens already pointed at the folder.

3. **Turn it into a repo and make the first save:**
   ```powershell
   git init
   git add .
   git commit -m "Initial handoff"
   ```

4. **Create the GitHub repo and push.** On github.com, click **New repository**, name it (e.g. `anamnesis`), leave it empty (no README), click **Create**. GitHub shows a URL like `https://github.com/YOURNAME/anamnesis.git`. Back in PowerShell:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/YOURNAME/anamnesis.git
   git push -u origin main
   ```
   *(First push may pop a GitHub sign-in — approve it.)*

5. **Open in Claude Code.** Launch the Claude Code desktop app → **Open Folder** → choose `c:\changers\anamnesis`. It automatically reads `CLAUDE.md` and now knows the whole project.

You're ready. From here you only paste prompts and review.

---

## Part 3 — How the automation works (plain English)
- **`CLAUDE.md`** is the rulebook. Claude Code reads it every session, so the stance and guardrails are always on — you never re-explain them.
- **The hook** (auto-checker): every time Claude Code writes a content file, a small script checks it for missing pieces and banned skeptic phrasing, and the result is fed back so Claude fixes it on the spot. You do nothing.
- **Two helper agents:** a **content-generator** (writes entries from the research) and a **compliance-reviewer** (checks each entry keeps the in-tradition voice and attributes every claim). The build uses them automatically.
- **`/gen-symbols`** is a one-word command that mass-produces entries (Part 5).
- **`RUNBOOK.md`** is the short version of the build prompts; this guide is the full version.

You stay in charge of the *look and feel* (you check each build phase). The machine handles the *writing and the rule-enforcement.*

---

## Part 4 — The build roadmap (paste these in order)

Paste each prompt into Claude Code, let it finish, then do the **Check** before the next. One phase per session is ideal. If a result drifts from the guardrails, just say: *"re-read CLAUDE.md and fix."*

### Phase 1 — Scaffold
> Read CLAUDE.md and everything in docs/. Scaffold an Astro project in this repo. Create the content collections defined in docs/02_BUILD_HANDOFF.md section 2 (symbols, figures, pillars, casebook, timeline, library, glossary, pathways) with typed frontmatter schemas. Add a tokens.css with neutral placeholder design tokens — no final palette. Do not build pages or components yet. Show me the folder structure and the schemas.

**Check:** run `npm run dev` in PowerShell — the dev site starts. Collections and schemas exist.

### Phase 2 — The component kit
> Build the 15-component kit from docs/02_BUILD_HANDOFF.md section 3, mobile-first, against the real entries in content-demo/. Use only the placeholder tokens. Make a /_preview page that renders every component with the demo data. Reduced-motion safe. No final colors.

**Check (phone):** every component shows with the demo content; nothing depends on a specific color.

### Phase 3 — The conversion spine
> Build the conversion-spine pages using the component kit and the content-demo/ entries: the Home page, the Dictionary index (faceted browse), the Symbol entry page, and one Casebook decode. Follow the layouts in docs/01_BLUEPRINT.md section 4. Mobile-first. The symbol entry should work both as a full page and as a bottom-sheet drawer opened from the grid.

**Check (phone):** you can browse the dictionary, filter it, open a symbol, read it. It should feel like a publication, not a homepage.

### Phase 4 — The motion moment
> Implement the Casebook "aha assembles" scroll set-piece from docs/02_BUILD_HANDOFF.md section 5.4 using GSAP ScrollTrigger — the artifact pins and its component symbols lift out into a symbol-lineage. Include the prefers-reduced-motion fallback (a static annotated diagram). Test it responsively.

**Check (phone, and with reduced-motion on):** the decode assembles on scroll and degrades cleanly to static.

### Phase 5 — Turn on the writing machine
See Part 5 — this is where the site fills with content.

### Phase 6 — Expand (paste as needed, one at a time)
> Build the Start Here on-ramp from docs/01_BLUEPRINT.md, with the intro motion in docs/02_BUILD_HANDOFF.md section 5.2.

> Build the Timeline scroll-story from docs/02_BUILD_HANDOFF.md section 5.5, using research/TIMELINE.md.

> Add global search and facet results across all collections.

> Write the remaining copy generators (gen-figure, gen-casebook, gen-pillar, gen-timeline, gen-library, gen-glossary, gen-pathway, gen-seo) as variations of prompts/gen-symbol.md, following docs/03_COPY_INVENTORY.md, then generate those collections.

**Check each on your phone before the next.** Lock the palette (Part 7) before scaling to the full content roster.

---

## Part 5 — The writing machine (filling the site)

The site needs ~50 symbols, ~28 figures, the casebook, etc. You don't write these — the machine does. **Do a small sample first, then batch.**

**Step 1 — sample (review closely).** In Claude Code:
> /gen-symbols 3

It generates three entries, auto-validates them, and the compliance agent checks them. Read the three. If the voice is right, continue. If not, tell it what to adjust — that correction improves every future batch.

**Step 2 — batch (sample-review only).** Once the voice is right:
> /gen-symbols 15

Repeat until the dictionary is full. Spot-check a few each batch rather than all of them — the hook and the compliance agent are doing the line-by-line checking.

**Step 3 — other content types.** After the figure/casebook/etc. generators are written (Phase 6), run them the same way (e.g. *"generate 10 figure entries from research/LINEAGE_PROFILES.md using gen-figure.md, review, validate, commit"*).

**Optional — fully hands-off (advanced).** For a long unattended run, `scripts/batch-generate.ps1` loops the roster using Claude Code's headless mode. It needs the CLI installed (`npm install -g @anthropic-ai/claude-code`). You don't need this to finish the site — `/gen-symbols` does the same job.

---

## Part 6 — Imagery

Plan and source list is in **`docs/05_IMAGE_SOURCES.md`** (open archives + APIs, what each is best for). The seed plates already in `assets/plates/` are enough to build and demo against. Add real per-entry imagery once the entry pages look right — easiest prompt when you're there:
> For the symbols that have entries, find a fitting public-domain plate using the sources in docs/05_IMAGE_SOURCES.md (prefer Wellcome, Wikimedia Commons, and the Internet Archive Manly P. Hall collection for esoteric imagery), download it into assets/plates/, and set each entry's glyph field to it.

---

## Part 7 — The palette (do this deliberately, later)
The colors are intentionally **not** locked. Build everything in neutral placeholder tokens first. When the structure feels right, run a dedicated design session to choose the per-section duotone wayfinding scheme and swap the tokens. Doing it last means one clean change instead of fighting color through every phase.

---

## Part 8 — Troubleshooting

- **"It looks vibe-coded / generic / just sitting there."** It's building against thin content or ignoring the spec. Say: *"Build this against the real content-demo entries and follow docs/01_BLUEPRINT.md section [X] exactly."*
- **It drifts from the stance** (adds skepticism, hedges, "balance"). Say: *"re-read CLAUDE.md and fix — advocacy, in-tradition, attribute every interpretive claim."* The hook also blocks the obvious skeptic phrases automatically.
- **`node` or `git` "not recognized."** Close and reopen PowerShell after installing; if still failing, reinstall that tool and accept defaults.
- **The hook seems not to run.** Confirm `.claude/settings.json` exists in the repo and Node is installed (`node --version`). The check runs on every file write.
- **A push is rejected.** Run `git pull --rebase origin main` then `git push` again.
- **You want to undo Claude Code's last changes.** `git restore .` (discards uncommitted edits) or `git log --oneline` then `git revert <id>`.

---

## Part 9 — Daily cheat sheet
- Start a session: open the folder in Claude Code (it reads CLAUDE.md automatically).
- Preview the site: `npm run dev` in PowerShell, open the local URL it prints.
- Generate content: `/gen-symbols 10`
- Save your work: `git add .` → `git commit -m "what changed"` → `git push`
- Fix drift: *"re-read CLAUDE.md and fix."*
- Undo uncommitted work: `git restore .`

That's the whole loop. Build the frame (Part 4), turn on the writing machine (Part 5), add imagery and palette last.
