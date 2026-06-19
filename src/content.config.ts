import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * ANAMNESIS — content collections (docs/02 §2; models from docs/00 §4a–4f).
 *
 * The relational graph (symbol ↔ figure ↔ casebook ↔ source ↔ timeline) is
 * resolved at build from these frontmatter cross-references — no database.
 * Cross-links are stored as plain slug strings (z.string()) rather than
 * Astro `reference()` so an entry can point at a target that hasn't been
 * authored yet (the roster fills in over many passes); the build's
 * "where-next" resolver and scripts/validate-content.mjs check both directions.
 *
 * Schemas are intentionally permissive on the editorial body (that lives in
 * MDX, enforced by the validator's required-section checks) and strict on the
 * graph + SEO/share metadata that the UI and share-cards depend on.
 */

/* ----------------------------------------------------------------------- */
/* Shared building blocks                                                  */
/* ----------------------------------------------------------------------- */

// Sourcing tier for a single citation (docs/00 §11): A = hard history,
// asserted as fact; B = proponent, always attributed; C = used sparingly.
const sourceTier = z.enum(["A", "B", "C"]);

// One citation. Kept loose on url/type so a source can be a book, lecture,
// engraving, or film without ceremony.
const source = z.object({
  title: z.string(),
  author: z.string().optional(),
  year: z.number().optional(),
  tier: sourceTier,
  type: z.enum(["book", "lecture", "film", "article", "engraving", "artifact", "other"]).optional(),
  url: z.string().url().optional(),
});

// Plate credit (Phase E3 — the legal gate). No real plate ships without its
// license recorded. `source` = the holding institution / platform; `creator` =
// artist/author when known (PD works are often anonymous); `license` = the
// human label (e.g. "Public Domain", "CC0", "CC BY 4.0"); `source_url` = the
// item/file page the plate was taken from; `license_url` = the licence deed.
const plateCredit = z.object({
  source: z.string(),
  creator: z.string().optional(),
  license: z.string(),
  license_url: z.string().url().optional(),
  source_url: z.string().url().optional(), // omitted only for original ANAMNESIS diagrams
});

// SEO + social fields shared by every shareable entry.
const seo = {
  seo_title: z.string(),
  seo_description: z.string(),
  share_line: z.string().optional(), // the one-line hook for the OG share-card
};

// Canonical symbol classes (docs/00 §7). Left as a free string so the finished
// content-demo entries (which use blends like "civic-solar") validate; the
// build can still group/facet on the canonical eight below.
//   solar-astro · sacred-geometry · alchemical · fraternal-masonic ·
//   corporate · civic-national · religious · occult
const symbolCategory = z.string();

/* ----------------------------------------------------------------------- */
/* 4c. SYMBOL ENTRY ★ (the flagship)                                        */
/* ----------------------------------------------------------------------- */

const symbols = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/symbols" }),
  schema: ({ image }) => z.object({
    name: z.string(),
    aka: z.array(z.string()).default([]),
    slug: z.string(),
    category: symbolCategory,
    tradition: z.string().optional(),
    era: z.string().optional(),
    // Real per-entry plate (astro:assets, Phase E). Sourced one-per-entry in E2;
    // when unset, the UI falls back to the transitional seed glyph below.
    plate: image().optional(),
    plate_credit: plateCredit.optional(), // E3 legal gate; required alongside a real plate
    glyph: z.string().optional(), // transitional seed plate (grayscale; retired in E5)
    one_line: z.string(),
    tier: sourceTier, // dominant sourcing tier of the reading (A asserted / B attributed)
    // Graph edges (slug references; resolved bidirectionally at build):
    decoded_by: z.array(z.string()).default([]),      // → figures
    related_symbols: z.array(z.string()).default([]), // → symbols
    appears_in: z.array(z.string()).default([]),      // → casebook
    timeline: z.string().optional(),                  // → timeline node
    sources: z.array(source).min(1),
    ...seo,
    // body (MDX) = ## Documented origin / ## The reading / ## Where it hides today
  }),
});

/* ----------------------------------------------------------------------- */
/* 4a. FIGURE PROFILE                                                        */
/* ----------------------------------------------------------------------- */

const figures = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/figures" }),
  schema: ({ image }) => z.object({
    name: z.string(),
    aka: z.array(z.string()).default([]),
    slug: z.string(),
    dates: z.string().optional(),       // "1940–2022" / "b. ~1959"
    tier: z.enum(["founder", "ancestor", "peer", "backbone"]),
    plate: image().optional(),          // real portrait plate (E2); seed = media.portrait
    plate_credit: plateCredit.optional(), // E3 legal gate
    one_line: z.string().optional(),
    role_in_lineage: z.string().optional(), // transmitter? source? scholar?
    core_claims: z.array(z.string()).default([]),
    key_works: z
      .array(z.object({ title: z.string(), year: z.number().optional(), url: z.string().url().optional() }))
      .default([]),
    signature_examples: z.array(z.string()).default([]),
    influenced_by: z.array(z.string()).default([]), // → figures
    influenced: z.array(z.string()).default([]),     // → figures
    media: z
      .object({ portrait: z.string().optional(), credit: z.string().optional(), license: z.string().optional() })
      .optional(),
    status_note: z.string().optional(), // living/active? deceased? where the archive lives
    sources: z.array(source).min(1),
    ...seo,
  }),
});

/* ----------------------------------------------------------------------- */
/* 4b. PILLAR / CONCEPT ENTRY (body = the essay)                            */
/* ----------------------------------------------------------------------- */

const pillars = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pillars" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    order: z.number().optional(),        // P1…P5 spine order
    plate: image().optional(),           // real plate (E2)
    plate_credit: plateCredit.optional(), // E3 legal gate
    glyph: z.string().optional(),        // transitional seed plate (retired in E5)
    thesis: z.string(),                  // one paragraph
    key_claims: z.array(z.string()).default([]),
    historical_anchors: z.array(z.string()).default([]), // the citable spine
    proponents: z.array(z.string()).default([]),  // → figures
    example_slots: z.array(z.string()).default([]), // → casebook
    related_symbols: z.array(z.string()).default([]), // → symbols
    sources: z.array(source).default([]),
    ...seo,
  }),
});

/* ----------------------------------------------------------------------- */
/* 4d. CASEBOOK ENTRY (a worked decode)                                     */
/* ----------------------------------------------------------------------- */

const casebook = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/casebook" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    artifact: z.string(),     // the logo / building / ad / ritual
    surface: z.string().optional(),   // what the public sees
    one_line: z.string().optional(),
    plate: image().optional(),        // real artifact plate (E2)
    plate_credit: plateCredit.optional(), // E3 legal gate
    glyph: z.string().optional(),     // transitional seed plate (retired in E5)
    // the_decode lives in the MDX body (attributed reading)
    symbol_lineage: z.array(z.string()).default([]), // → symbols, in assemble order (§5.4)
    // Optional marker positions for the "aha assembles" set-piece (docs/02 §5.4):
    // each marker pins a component symbol to a spot on the artifact (x/y in %).
    assemble: z
      .array(
        z.object({
          slug: z.string(),
          x: z.number().min(0).max(100),
          y: z.number().min(0).max(100),
          blurb: z.string().optional(),
        })
      )
      .optional(),
    who_made_this_claim: z.array(z.string()).default([]), // → figures
    related_symbols: z.array(z.string()).default([]),     // → symbols
    sources: z.array(source).min(1),
    media: z
      .object({ credit: z.string().optional(), license: z.string().optional() })
      .optional(),
    ...seo,
  }),
});

/* ----------------------------------------------------------------------- */
/* 4e. TIMELINE EVENT                                                        */
/* ----------------------------------------------------------------------- */

const timeline = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/timeline" }),
  schema: ({ image }) => z.object({
    slug: z.string(),
    date: z.string(),          // "~375 BCE" / "726–843" / "2022"
    sort: z.number(),          // numeric key for ordering the scroll-story (§5.5)
    era: z.enum(["sacred", "mechanical", "algorithmic"]).optional(), // the three acts
    event: z.string(),
    why_it_matters: z.string(), // the image-control angle
    linked_figures: z.array(z.string()).default([]), // → figures
    linked_symbols: z.array(z.string()).default([]), // → symbols
    plate: image().optional(),  // real plate (E2)
    plate_credit: plateCredit.optional(), // E3 legal gate
    glyph: z.string().optional(), // transitional seed plate (retired in E5)
    sources: z.array(source).default([]),
    ...seo,
  }),
});

/* ----------------------------------------------------------------------- */
/* 4f. LIBRARY / SOURCE ENTRY                                                */
/* ----------------------------------------------------------------------- */

const library = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/library" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    author: z.string().optional(),
    year: z.number().optional(),
    type: z.enum(["book", "lecture", "film", "article", "engraving", "artifact", "other"]),
    tier: sourceTier,
    link: z.string().url().optional(),
    summary: z.string().optional(),
    used_by: z.array(z.string()).default([]), // → any entry slug (resolved at build)
    ...seo,
  }),
});

/* ----------------------------------------------------------------------- */
/* GLOSSARY TERM                                                             */
/* ----------------------------------------------------------------------- */

const glossary = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/glossary" }),
  schema: z.object({
    term: z.string(),
    slug: z.string(),
    aka: z.array(z.string()).default([]),
    definition: z.string(),     // plain-language gloss (body may extend it)
    see_also: z.array(z.string()).default([]),  // → glossary
    related_symbols: z.array(z.string()).default([]), // → symbols
    related_figures: z.array(z.string()).default([]), // → figures
    sources: z.array(source).default([]),
  }),
});

/* ----------------------------------------------------------------------- */
/* PATHWAY (an ordered, curated walk through entries)                       */
/* ----------------------------------------------------------------------- */

const pathways = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pathways" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    one_line: z.string().optional(),
    glyph: z.string().optional(),
    // Ordered stops, each a slug into another collection + the connective copy
    // shown between stops (the Pathway-stop component, docs/02 §3.11).
    stops: z
      .array(
        z.object({
          collection: z.enum(["symbols", "figures", "pillars", "casebook", "timeline", "library"]),
          slug: z.string(),
          note: z.string().optional(),
        })
      )
      .min(1),
    ...seo,
  }),
});

export const collections = {
  symbols,
  figures,
  pillars,
  casebook,
  timeline,
  library,
  glossary,
  pathways,
};
