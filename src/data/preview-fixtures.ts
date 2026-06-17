/**
 * Preview-only fixtures for /_preview. The three SYMBOL entries the gallery
 * renders are the REAL content-demo files (loaded from the symbols collection).
 * The sibling cards (figure, casebook, timeline, pathway) have no demo entries
 * yet, so these stand-ins are derived from the demo's own cross-references
 * (jordan-maxwell, manly-p-hall, great-seal-pyramid…) to keep the graph
 * coherent. They live in src/data, NOT src/content — they are not canonical.
 */

export const figures = [
  {
    name: "Jordan Maxwell",
    slug: "jordan-maxwell",
    tier: "founder" as const,
    dates: "1940–2022",
    one_line: "Astrotheology, etymology, and the secret language of the state.",
  },
  {
    name: "Manly P. Hall",
    slug: "manly-p-hall",
    tier: "ancestor" as const,
    dates: "1901–1990",
    one_line: "Author of The Secret Teachings of All Ages; keeper of the initiatic tradition.",
  },
  {
    name: "David Icke",
    slug: "david-icke",
    tier: "peer" as const,
    dates: "b. 1952",
    one_line: "Reads Saturn and the cube as the geometry of control.",
  },
];

export const casebook = [
  {
    title: "The Great Seal & the Unfinished Pyramid",
    slug: "great-seal-pyramid",
    artifact: "The Great Seal of the United States",
    one_line: "The watching eye, the unfinished work, and the date of a new order — printed on the dollar.",
    glyph: "../../assets/plates/kircher.jpg",
    symbol_lineage: ["all-seeing-eye", "sun-cross", "as-above-so-below"],
  },
];

export const timelineNodes = [
  {
    date: "~375 BCE",
    era: "sacred" as const,
    event: "Plato bans the poets",
    why_it_matters:
      "In the Republic the ideal state must control which stories and images reach the soul. The thesis is set: whoever owns representation owns the interior life of a people.",
    glyph: "../../assets/plates/cosmos.jpg",
    links: [{ label: "Pillar P1 — Who controls the image", href: "/pillars/who-controls-the-image" }],
  },
  {
    date: "2022–2026",
    era: "algorithmic" as const,
    event: "The image-machine is privatized",
    why_it_matters:
      "AI image generation puts the entire visual unconscious under whoever owns the models — Plato's nightmare, fully industrialized.",
    glyph: "../../assets/plates/fluddmind.jpg",
    links: [{ label: "Pillar P5 — Symbolic illiteracy", href: "/pillars/symbolic-illiteracy" }],
  },
];

export const pathway = {
  title: "The Eye on the Dollar",
  slug: "the-eye-on-the-dollar",
  one_line: "Three plates that teach you to read the symbol in your pocket.",
  glyph: "../../assets/plates/kircher.jpg",
  stops: [
    {
      connective: "Begin with the symbol everyone has held and no one has read.",
      slug: "all-seeing-eye",
    },
    {
      connective: "The same logic of correspondence runs from the cosmos to the coin.",
      slug: "as-above-so-below",
    },
    {
      connective: "And where the eye watches, another geometry confines.",
      slug: "saturn-and-the-black-cube",
    },
  ],
};

export const searchResults = [
  { kind: "Symbol", name: "The All-Seeing Eye", slug: "all-seeing-eye", href: "/dictionary/all-seeing-eye" },
  { kind: "Symbol", name: "Saturn & the Black Cube", slug: "saturn-and-the-black-cube", href: "/dictionary/saturn-and-the-black-cube" },
  { kind: "Figure", name: "Jordan Maxwell", slug: "jordan-maxwell", href: "/figures/jordan-maxwell" },
  { kind: "Casebook", name: "The Great Seal & the Unfinished Pyramid", slug: "great-seal-pyramid", href: "/casebook/great-seal-pyramid" },
];

export const facetGroups = [
  {
    key: "cat",
    label: "Category",
    options: [
      { value: "civic-solar", label: "Civic-solar" },
      { value: "alchemical", label: "Alchemical" },
      { value: "occult", label: "Occult" },
      { value: "sacred-geometry", label: "Sacred geometry" },
    ],
  },
  {
    key: "tier",
    label: "Sourcing",
    options: [
      { value: "A", label: "A · asserted" },
      { value: "B", label: "B · attributed" },
    ],
  },
];
