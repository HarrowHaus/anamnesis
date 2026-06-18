# Plates — real per-entry assets (Phase E)

Real, license-verified plates live here, one file per entry, processed by
`astro:assets`. This is the locked E1 architecture; E2 fills it in.

## Layout (locked)

```
src/assets/plates/
  symbols/<slug>.{webp,jpg}
  figures/<slug>.{webp,jpg}
  casebook/<slug>.{webp,jpg}
  pillars/<slug>.{webp,jpg}
  timeline/<slug>.{webp,jpg}
```

`<slug>` is the entry's `slug` (so `src/content/symbols/all-seeing-eye.mdx`
→ `src/assets/plates/symbols/all-seeing-eye.webp`).

## Wiring

Each entry references its plate from frontmatter via the schema's `image()`
field, resolved relative to the content file:

```yaml
# src/content/symbols/all-seeing-eye.mdx
plate: ../../assets/plates/symbols/all-seeing-eye.webp
```

`src/lib/plates.ts` prefers this real `plate` and emits `data-plate="real"`.
When `plate` is unset, the UI falls back to the transitional **seed** plate
(`glyph`, served from `/public/plates`, rendered grayscale and labeled
`data-plate="seed"`). The seeds stay until **E5** retires the seed mapping.

## License gate (E3)

No plate ships without its source/creator/license/URL recorded. Verify each
image is genuinely public-domain / CC0 before adding it (see
`docs/05_IMAGE_SOURCES.md`); if a license is unclear, skip and log the entry.
