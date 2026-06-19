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
// A processed astro:assets plate. Raster imports are objects; SVG imports come
// back as a renderable *component* (a function) with `.src` attached — so accept
// both object and function shapes that carry a `src`.
function asAsset(plate?: ImageMetadata | string | null): { src: string } | null {
  if (plate && (typeof plate === "object" || typeof plate === "function") && "src" in plate) {
    return plate as unknown as { src: string };
  }
  return null;
}

export function plateUrl(
  plate?: ImageMetadata | string | null,
  seedGlyph?: string | null
): string | null {
  // 1. Real astro:assets plate wins (raster object or SVG component).
  const asset = asAsset(plate);
  if (asset) return asset.src;
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
  return !asAsset(plate);
}
