/**
 * Where-next scoring (docs/02 §3.9): shared category > shared tradition >
 * shared figure. Capped so the list feels curated, never exhaustive.
 * Pure + data-shaped so it works on real collection entries or fixtures.
 */
export interface Relatable {
  slug: string;
  name: string;
  category?: string;
  tradition?: string;
  decoded_by?: string[];
}

export interface WhereNextItem {
  item: Relatable;
  relation: string; // human label shown on the link
  score: number;
}

export function whereNext(current: Relatable, pool: Relatable[], cap = 4): WhereNextItem[] {
  const figures = new Set(current.decoded_by ?? []);
  return pool
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      if (p.category && p.category === current.category)
        return { item: p, relation: `Also ${p.category}`, score: 3 };
      if (p.tradition && p.tradition === current.tradition)
        return { item: p, relation: `Same tradition`, score: 2 };
      if ((p.decoded_by ?? []).some((f) => figures.has(f)))
        return { item: p, relation: `Shared decoder`, score: 1 };
      return { item: p, relation: `Related`, score: 0 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, cap);
}
