// Static search index (handoff §0.6). Emitted at build to /search-index.json;
// /search fetches + filters it client-side. One flat record per entry.
//
// Only the populated collections are queried (Astro warns on empty ones).
// TODO: extend as collections fill — timeline (C), library + glossary (D1/D2).
// Add the collection's block below when it has entries.
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export interface SearchRecord {
  collection: string;
  kind: string;
  slug: string;
  title: string;
  one_line: string;
  category: string;
  tier: string;
  url: string;
}

export const GET: APIRoute = async () => {
  const records: SearchRecord[] = [];

  for (const e of await getCollection("symbols")) {
    records.push({
      collection: "symbols", kind: "Symbol", slug: e.data.slug, title: e.data.name,
      one_line: e.data.one_line, category: e.data.category, tier: e.data.tier,
      url: `/dictionary/${e.data.slug}`,
    });
  }

  for (const e of await getCollection("figures")) {
    records.push({
      collection: "figures", kind: "Figure", slug: e.data.slug, title: e.data.name,
      one_line: e.data.one_line ?? "", category: e.data.tier, tier: "",
      url: `/figures/${e.data.slug}`,
    });
  }

  for (const e of await getCollection("casebook")) {
    records.push({
      collection: "casebook", kind: "Decode", slug: e.data.slug, title: e.data.title,
      one_line: e.data.one_line ?? "", category: e.data.artifact, tier: "",
      url: `/casebook/${e.data.slug}`,
    });
  }

  for (const e of await getCollection("pillars")) {
    records.push({
      collection: "pillars", kind: "Pillar", slug: e.data.slug, title: e.data.title,
      one_line: e.data.thesis ?? "", category: "", tier: "",
      url: `/pillars/${e.data.slug}`,
    });
  }

  return new Response(JSON.stringify(records), {
    headers: { "Content-Type": "application/json" },
  });
};
