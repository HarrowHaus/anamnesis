import type { ImageMetadata } from "astro";

/**
 * Resolve an entry's plate to a browser URL.
 *
 * Phase-E asset pipeline. Two sources, in priority order:
 *  1. `plate` — a real per-entry image processed by astro:assets (the `image()`
 *     schema field). When present, its optimized `.src` always wins.
 *  2. `seedGlyph` — the transitional seed plate: a basename served from
 *     /public/plates. Kept (grayscale, visibly provisional) until E5 retires it.
 *
 * Back-compatible: a lone string argument is treated as a seed glyph, so legacy
 * `plateUrl(data.glyph)` calls keep working unchanged.
 */
export function plateUrl(
  plate?: ImageMetadata | string | null,
  seedGlyph?: string | null
): string | null {
  // 1. Real astro:assets plate wins.
  if (plate && typeof plate === "object" && "src" in plate) return plate.src;
  // 2. Transitional seed fallback (basename under /plates).
  const glyph = typeof plate === "string" ? plate : seedGlyph;
  if (!glyph) return null;
  const base = glyph.split(/[\\/]/).pop();
  return base ? `/plates/${base}` : null;
}

/**
 * True when the plate resolves to a transitional seed image rather than a real
 * per-entry asset. Drives the `data-plate="seed|real"` label so seed plates read
 * as provisional (and can be swept up when E5 retires the seed mapping).
 */
export function isSeedPlate(plate?: ImageMetadata | string | null): boolean {
  return !(plate && typeof plate === "object" && "src" in plate);
}
