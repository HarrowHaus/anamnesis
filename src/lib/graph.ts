/**
 * Build the relation payloads the entry pages + drawers need, from the loaded
 * collections. Keeps the symbol↔casebook graph resolution in one place.
 */
import type { ImageMetadata } from "astro";
import { whereNext, type Relatable, type WhereNextItem } from "./relations";

export interface Symbolish {
  slug: string;
  name: string;
  category: string;
  tradition?: string;
  era?: string;
  tier: "A" | "B" | "C";
  plate?: ImageMetadata;
  glyph?: string;
  one_line: string;
  decoded_by?: string[];
}

/** A scoring pool that carries through the fields the specimen card renders. */
export function buildPool(symbols: Symbolish[]): Relatable[] {
  return symbols.map((s) => ({
    slug: s.slug, name: s.name, category: s.category, tradition: s.tradition,
    decoded_by: s.decoded_by,
    // passthrough for the card the WhereNext list renders
    one_line: s.one_line, tier: s.tier, plate: s.plate, glyph: s.glyph,
  })) as Relatable[];
}

export function relatedFor(current: Symbolish, pool: Relatable[], cap = 4): WhereNextItem[] {
  return whereNext(
    { slug: current.slug, name: current.name, category: current.category, tradition: current.tradition, decoded_by: current.decoded_by },
    pool,
    cap
  );
}

/**
 * Resolve which casebook decodes a symbol appears in, both ways:
 *  - explicit `appears_in` slugs on the symbol, plus
 *  - any casebook whose `symbol_lineage` lists this symbol (reverse index, at build).
 * Deduped, so a decode declared on both sides shows once. This keeps the
 * symbol↔casebook graph bidirectional without per-symbol frontmatter upkeep.
 */
export function appearsInFor(
  symbolSlug: string,
  appears_in: string[] | undefined,
  casebook: { slug: string; title: string; symbol_lineage?: string[] }[]
): { slug: string; title: string }[] {
  const out = new Map<string, { slug: string; title: string }>();
  for (const s of appears_in ?? []) {
    const c = casebook.find((e) => e.slug === s);
    if (c) out.set(c.slug, { slug: c.slug, title: c.title });
  }
  for (const c of casebook) {
    if ((c.symbol_lineage ?? []).includes(symbolSlug)) out.set(c.slug, { slug: c.slug, title: c.title });
  }
  return [...out.values()];
}
