---
description: Batch-generate Symbol Dictionary entries from research, review, validate, and commit.
---

Generate a batch of Symbol Dictionary entries. Argument: how many to generate (default 5), optionally specific symbol names. `$ARGUMENTS`

Steps:
1. Read `research/SYMBOL_DICTIONARY.md` and list `src/content/symbols/`. Determine the next N symbols that do **not** yet have an entry (or the specific ones named in the argument).
2. For each symbol, use the **content-generator** subagent with `prompts/gen-symbol.md` to write `src/content/symbols/<slug>.mdx`.
3. After each entry, the PostToolUse hook runs the validator automatically. If it reports errors, fix them before moving on.
4. Hand each finished entry to the **compliance-reviewer** subagent. Apply its fixes.
5. When the batch is clean (validator passes with zero errors for all new files), stage and commit them: `git add src/content/symbols && git commit -m "content: add N symbol entries"`.
6. Report a short summary: which symbols were added, any `TODO(research)` gaps, and any entries the reviewer flagged.

Stop after the batch — do not continue to the next batch unless asked. Keep each entry within the word budgets in `prompts/gen-symbol.md`, and never weaken the in-tradition stance to sound neutral.
