# Image Sources & APIs

Open / public-domain imagery for ANAMNESIS, prioritized for this project's needs (esoteric engravings, alchemical and astrological plates, civic and corporate symbols, portraits). Always confirm the license shown on the specific item's page before use — collections mix public-domain and rights-restricted material.

## License shorthand
- **CC0 / Public Domain** — no permission, no attribution required (attribution still courteous).
- **CC-BY** — free to use *with* attribution.
- **PDM (Public Domain Mark)** — flagged as public domain.

---

## Tier 1 — esoteric / occult / alchemical (the project's core imagery)

**Wellcome Collection** — the single best source for occult, alchemical, astrological, and medical-magical imagery. Over 40 million images digitized from 325,000+ items, openly licensed (mostly **CC-BY**, attribution "Wellcome Collection"); holdings include ~17,500 magic-medical amulets, talismans, and charms. Browse and download at wellcomecollection.org; also mirrored on Wikimedia Commons. *Best for:* alchemical diagrams, astrological charts, grimoire pages, talismans.

**Wikimedia Commons** — the primary working source (already used for the seed plates). Tens of millions of freely licensed/PD files with a real query API (MediaWiki `action=query`). *Best for:* named historical plates (Flammarion, Dürer, Fludd, Kircher, Hildegard, Tree of Life, zodiac man), portraits of figures, civic symbols. License varies per file — check each.

**Internet Archive (archive.org)** — scanned full books and plate sets, including the **Manly P. Hall** collection and other primary esoteric texts. *Best for:* full-resolution plates from period books (e.g. *The Secret Teachings of All Ages*), title pages, engravings in context. Has an API and direct file access; check each item's rights.

**The Public Domain Review** — curated public-domain imagery with an image archive (pdimagearchive.org), strong on the surreal/esoteric. *Best for:* hand-picked, high-interest plates and leads back to the source institution.

**sacred-texts.com** — digitized esoteric texts and their plates (Knapp's color plates for the *Secret Teachings*, Kabbalistic and Hermetic diagrams). *Best for:* hard-to-find diagram scans; verify public-domain status per image.

---

## Tier 2 — museum open-access APIs (CC0, programmatic, high-res)

All of these are **CC0** and offer APIs/datasets — ideal for fetching art, artifacts, and symbol-bearing objects at scale.

- **The Met (Metropolitan Museum of Art) Open Access** — CC0 since 2017; images + data for all accessioned works, REST API and datasets. Huge, high-resolution. *Best for:* antiquities, Egyptian/solar artifacts, prints.
- **Cleveland Museum of Art** — CC0; clean JSON API at `openaccess-api.clevelandart.org/api/artworks/` (filter `cc0`), plus GitHub data. Daily-updated `share_license_status` field tells you which items ship CC0 images.
- **Art Institute of Chicago** — 50,000+ CC0 images; public API (`api.artic.edu`); filter the collection by "public domain" / "CC0."
- **Smithsonian Open Access / Cooper Hewitt** — millions of CC0 items with an API; design and decorative-arts symbol material.
- **National Gallery of Art (NGA)** — Open Access images, very permissive (incl. commercial); data on GitHub.
- **Getty Open Content** — ~99,000+ open images; strong on prints, drawings, and rare-book engravings.
- **Rijksmuseum** — CC0 with a well-documented API; excellent print and engraving holdings.

---

## Tier 3 — aggregators (search many institutions at once)

- **Europeana** — 50M+ items from thousands of European institutions; API with license filtering (isolate PD/CC0). *Best for:* breadth across European esoteric and religious art.
- **DPLA (Digital Public Library of America)** — aggregates U.S. libraries/archives/museums; API. *Best for:* American civic and historical imagery.
- **Openverse** — open-license search across 800M+ CC/PD images with an API. *Best for:* a fast first sweep when you don't know the holding institution.
- **Flickr Commons** — "no known copyright restrictions" photostreams from institutions. *Best for:* historical photography, portraits.
- **Library of Congress — Free to Use & Reuse** — cleared sets (posters, maps, photographs) over a much larger digitized collection; API. *Best for:* American civic symbols, documents.
- **NYPL Digital Collections** — large public-domain set with an API. *Best for:* prints, maps, ephemera.

---

## Tier 4 — specialist
- **Biodiversity Heritage Library (BHL)** — public-domain scientific/natural-history illustrations; API. *Best for:* botanical/anatomical plates (e.g. the zodiac-man / anatomical tradition).
- **Project Gutenberg** — public-domain books; useful for in-context illustration scans and primary text.

---

## Routing — which source per content type
- **Symbol entries (esoteric):** Wellcome → Wikimedia Commons → Internet Archive (Hall) → sacred-texts.
- **Symbol entries (corporate/civic):** the symbol's own historical marks via Wikimedia Commons + Library of Congress; for logos, prefer describing/recreating over reproducing trademarked marks.
- **Figure portraits:** Wikimedia Commons → Flickr Commons → the museum APIs.
- **Casebook plates & timeline nodes:** Wellcome + Wikimedia + the museum CC0 APIs.
- **Texture / period art:** Met, Rijksmuseum, Getty, Art Institute (all CC0).

## Practical notes
- **Trademarks ≠ copyright.** Modern corporate logos may be public-domain *as images* yet still trademarked. For active brands, prefer Claude-built recreations or clearly editorial use; keep the analysis transactional, not endorsing.
- **Attribution:** CC0 needs none; Wellcome and CC-BY need a credit line — store it in each entry's `sources`/`glyph_credit` so it renders automatically.
- **Resolution:** pull the highest-res available, then downscale in-build; the seed plates show the grayscale-to-duotone pipeline the build will reuse.
