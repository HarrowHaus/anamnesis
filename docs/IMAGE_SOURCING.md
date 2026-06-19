# IMAGE_SOURCING.md — paced, resumable, multi-host plate sourcing (Phase E2)

The protocol for sourcing every per-entry plate without tripping host rate limits. Supersedes ad-hoc downloading. Read together with `docs/05_IMAGE_SOURCES.md` (where to look) and `docs/IMAGE_BACKLOG.md` (what's unresolved). Same license discipline as before: **PD/CC0 preferred; CC-BY / CC-BY-SA accepted with attribution; never reproduce a live trademark; some entries are deliberately not sourced (see Exclusions).**

## Why this exists
Routing every download at `upload.wikimedia.org` triggered sustained HTTP 429s that didn't clear on naive backoff. The fix is not "wait and retry the same way" — it's: send a compliant client, pull sized images via APIs, spread load across hosts, **decouple sourcing from downloading so a rate limit never costs work**, and stop downloading shapes you can draw.

---

## 1. Two-pass architecture (the core rule)
Never source-and-download in one shot. Split it:

**Pass A — Source → `data/plate-manifest.json`.** Per entry, resolve the chosen image and record its metadata. This is mostly lightweight API/metadata calls (low throttle risk). One record per entry:
```json
{
  "collection": "figures",
  "slug": "manly-p-hall",
  "status": "sourced",            // sourced | downloaded | backlog | svg | excluded
  "host": "loc",                  // commons | met | aic | cleveland | wellcome | ia | loc | nypl | rijks | smithsonian
  "image_url": "https://.../full/1200,/0/default.jpg",
  "license": "PD",                // PD | CC0 | CC-BY | CC-BY-SA
  "creator": "…",
  "credit": "Library of Congress, PPOC — public domain",
  "source_page": "https://www.loc.gov/item/…",
  "local_path": "src/assets/plates/figures/manly-p-hall.webp"
}
```
**Pass B — Fetch.** A resumable downloader reads the manifest, **skips any entry whose `local_path` already exists on disk**, downloads the rest paced + host-rotated, sets `status: downloaded`. A 429 now just means "run Pass B again later" — it resumes and grabs only what's missing. You never re-source.

**Idempotency is mandatory:** both passes must be safe to re-run any number of times. Pass A skips entries already `sourced`/`downloaded`; Pass B skips files already on disk.

---

## 2. Client rules (apply to every request)
- **User-Agent (required by Wikimedia, good manners everywhere):** `AnamnesisImageSourcer/1.0 (https://anamnesis-1yc.pages.dev; <contact-email-or-url>)`. A generic/library UA is the single most common cause of hard throttling — never ship without this.
- **Honor `Retry-After`.** On 429/503, read the `Retry-After` header and wait exactly that long (fall back to exponential backoff with jitter only if absent). Do not poke before the window resets.
- **Pace + serialize:** one request at a time per host, ~1–2 s apart with jitter. Slower-but-finishing beats fast-then-blocked.
- **Pull sized images, not originals.** You need ~1000–1400px for web plates, not 4000px scans. Use the host's thumbnail/IIIF size parameter (below). Smaller = faster = lighter on the host.

### Wikimedia, done right
Use the API for both the image URL and the credit in one call — not the raw file server:
```
https://commons.wikimedia.org/w/api.php?action=query&format=json
  &titles=File:<NAME>&prop=imageinfo
  &iiprop=url|extmetadata&iiurlwidth=1200
```
`imageinfo[0].thumburl` is a server-sized JPEG; `extmetadata` carries `LicenseShortName`, `Artist`, `Credit`. Download the `thumburl`. This routes through the API + thumb cache, which tolerate automation far better than `upload.wikimedia.org`.

---

## 3. Source routing — spread load by content type
Don't funnel everything through Commons. Route to the best host for the material, which also keeps any one host under its limit. **No-key, CC0-friendly hosts first** (use these for rotation):

| Material | Primary hosts (rotate) | Notes |
|---|---|---|
| Historical figure portraits | **Library of Congress** (`loc.gov/...?fo=json`, PPOC), **NYPL Digital Collections**, **Smithsonian Open Access** | huge PD portrait sets, proper APIs |
| Engravings / plates / diagrams | **Met Open Access** (`collectionapi.metmuseum.org`, CC0, no key), **Art Institute** (`api.artic.edu`, IIIF), **Cleveland** (`openaccess-api.clevelandart.org`, CC0), **Rijksmuseum** (API key; vast PD engravings), **Wellcome Collection** (IIIF) | best originals; CC0 sources need no attribution but record it anyway |
| Books / broadsides / timeline scans | **Internet Archive** (metadata API + `/download/`), **Wellcome** | good for printed matter |
| Last resort / specific files | **Wikimedia Commons** (via the API pattern above) | use sparingly, paced |

Keys: Met/AIC/Cleveland/LoC need none. Rijksmuseum, NYPL, Smithsonian, Europeana need a free key — request once, store in env, don't hardcode.

**Rotation rule:** within a batch, alternate hosts so consecutive requests rarely hit the same domain. If one host 429s, mark its queued items `status: sourced` and keep going on other hosts; circle back in Pass B.

---

## 4. Draw what you can't (or shouldn't) download
A large part of the backlog is **pure geometry or typographic form**, not a specific historical artwork — uncopyrightable shapes that don't need a source at all. **Recreate these as original SVG plates** instead of downloading:
- hexagram, sun-cross, pentagram (clean diagram), inverted pentagram, golden-ratio / spiral, vesica piscis, letter-G, checkerboard floor, and similar constructed marks.
- Render as ink-on-transparent line art at the standard plate ratio, tonally neutral so the Phase-F duotone applies cleanly. Mark `status: svg`, `license: "original-cc0"`, `credit: "Original diagram — ANAMNESIS"`.
This clears roughly half the no-PD-raster backlog with **zero downloads, zero licensing risk**, and better visual consistency than scrounged scans. Prefer SVG recreation for any geometric/diagrammatic symbol even when a raster exists.

---

## 5. Exclusions & trademarks (unchanged, restated)
- **Live corporate logos** (Apple, Starbucks, CBS, etc.): never reproduce the trademark. Source the **antecedent** image (the historical symbol the logo descends from) or commission an original; `status: backlog` with a note until done.
- **Extremist-glorifying imagery** (e.g. black-sun): deliberately **not sourced**. `status: excluded`, with the reason. The entry's text still stands; the plate stays the neutral fallback.
- Anything whose license can't be verified PD/CC0/CC-BY(-SA): `status: backlog`, never ship on a guess.

---

## 6. Run order, pacing budget, acceptance
- **Order:** figures → pillars → timeline → casebook (symbols are done). Within each, go in category/section batches.
- **Budget:** keep total throughput modest (≈1 req/host/1–2 s). If a host 429s twice after honoring `Retry-After`, stop that host for the run and continue others; resume later.
- **If 429s persist across all hosts:** the executing IP (a shared/datacenter session) is likely the problem — run **Pass B from a local/residential machine**, which has a cleaner per-IP reputation. Pass A (manifest) can stay wherever.
- **Per batch:** validate licenses present, plates wired via `image()`, credit line rendered, alt text set; `npm run build` clean. Commit `feat(images): <collection>/<category> plates + credits`.
- **Acceptance (Phase E close):** every entry is `downloaded` or `svg`, or explicitly `backlog`/`excluded` in `docs/IMAGE_BACKLOG.md` with a reason. No silent gaps.

---

## 7. What stays in the backlog file
`docs/IMAGE_BACKLOG.md` tracks every `backlog`/`excluded` entry with: slug, reason (no clean PD raster / trademark / ethics), and the best lead found. The neutral `.u-plate-fallback` hatch renders for these until resolved — never a seed repeat (post-E5), never a broken image.
