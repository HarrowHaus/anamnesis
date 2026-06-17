/**
 * Build the relation payloads the entry pages + drawers need, from the loaded
 * collections. Keeps the symbol↔casebook graph resolution in one place.
 */
import { whereNext, type Relatable, type WhereNextItem } from "./relations";

export interface Symbolish {
  slug: string;
  name: string;
  category: string;
  tradition?: string;
  era?: string;
  tier: "A" | "B" | "C";
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
    one_line: s.one_line, tier: s.tier, glyph: s.glyph,
  })) as Relatable[];
}

export function relatedFor(current: Symbolish, pool: Relatable[], cap = 4): WhereNextItem[] {
  return whereNext(
    { slug: current.slug, name: current.name, category: current.category, tradition: current.tradition, decoded_by: current.decoded_by },
    pool,
    cap
  );
}

/** Resolve a symbol's `appears_in` slugs to casebook titles (built entries only). */
export function appearsInFor(
  appears_in: string[] | undefined,
  casebookBySlug: Map<string, { slug: string; title: string }>
): { slug: string; title: string }[] {
  return (appears_in ?? []).map((s) => casebookBySlug.get(s)).filter(Boolean) as { slug: string; title: string }[];
}
