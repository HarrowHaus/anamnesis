/**
 * Resolve a frontmatter `glyph` path to a browser URL.
 *
 * Demo entries store paths like "../../assets/plates/kircher.jpg" (relative to
 * the content file). During this placeholder phase the plates are served from
 * /public/plates, so we map any glyph to its basename under /plates. When the
 * duotone/asset pipeline lands, this is the single seam to change.
 */
export function plateUrl(glyph?: string): string | null {
  if (!glyph) return null;
  const base = glyph.split(/[\\/]/).pop();
  return base ? `/plates/${base}` : null;
}
