# ============================================================================
#  ANAMNESIS — headless batch generator  (ADVANCED / OPTIONAL)
# ============================================================================
#  Hands-off bulk content generation. Loops the symbol roster and calls Claude
#  Code in headless mode (claude -p) once per entry. This is the "API workers"
#  pattern, available now — no API code.
#
#  YOU PROBABLY DON'T NEED THIS to start. The in-app  /gen-symbols  command does
#  the same job interactively and is the recommended path. Use this only when you
#  want a long unattended run.
#
#  REQUIRES the Claude Code CLI on your PATH:
#      npm install -g @anthropic-ai/claude-code
#  Verify with:  claude --version
#
#  RUN (from the repo root  c:\changers\anamnesis ):
#      powershell -ExecutionPolicy Bypass -File scripts\batch-generate.ps1 -Count 10
# ============================================================================

param(
  [int]$Count = 10,                          # how many entries this run
  [string]$Model = "claude-haiku-4-5-20251001"  # cheap/fast model for bulk copy
)

$ErrorActionPreference = "Stop"
Write-Host "ANAMNESIS batch generator — up to $Count entries on $Model" -ForegroundColor Cyan

for ($i = 1; $i -le $Count; $i++) {
  Write-Host "`n[$i/$Count] generating next symbol entry..." -ForegroundColor Yellow

  $prompt = @"
Read prompts/gen-symbol.md and research/SYMBOL_DICTIONARY.md. List src/content/symbols/ and pick the FIRST symbol that does not yet have an entry. Generate one finished entry for it as drop-in MDX, written to src/content/symbols/<slug>.mdx, following the template's schema, word budgets, and guardrails exactly. Then hand it to the compliance-reviewer subagent and apply fixes. Do not commit. If every symbol already has an entry, output exactly: ALL_DONE
"@

  $out = $prompt | claude -p --model $Model --permission-mode acceptEdits 2>&1
  Write-Host $out

  if ($out -match "ALL_DONE") { Write-Host "`nRoster complete." -ForegroundColor Green; break }

  # Validate; stop the run if the validator reports hard errors.
  node scripts/validate-content.mjs
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Validator failed — stopping so you can review." -ForegroundColor Red
    break
  }
}

# Commit whatever passed.
git add src/content/symbols
git commit -m "content: batch-generated symbol entries" 2>$null
Write-Host "`nDone. Review with: git log --oneline -5" -ForegroundColor Cyan
