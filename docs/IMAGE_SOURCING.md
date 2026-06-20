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

### Living-figure portraits — usable-photo search ladder
Living people rarely have a PD portrait, but many have a genuinely **usable** (free-licensed or permissioned) photo. For each living figure work this ladder in order, stop at the first verified hit:
1. **Wikipedia / Wikimedia Commons infobox photo** — if the person has a Wikipedia article with a photo it is already free-licensed (Wikipedia hosts only free images for living people). Fastest win.
2. **Openverse** (openverse.org) — aggregates CC across Flickr, Wikimedia, museums; filter to CC0 / CC-BY / CC-BY-SA.
3. **Flickr Creative Commons search** — filter to CC-BY / CC-BY-SA; conference, podcast, and event photos of public figures are common.
4. **Public-domain government / public-record sources** — US federal works (testimony, official events) are PD; verify the specific source's license.
5. **Official press kit / direct permission** — the figure's own site may offer a press photo or grant use on request; if granted, record who/when/scope as the credit and treat as licensed.

Two hard checks on every candidate before it ships: (a) the **license is genuinely** PD/CC0/CC-BY/CC-BY-SA or explicitly permissioned, and (b) the **subject is unambiguously the right person** — cross-check against a second known image; never a look-alike or a same-name different-person. Full `plate_credit` always. Anything failing either check stays backlog and the figure falls to the designed no-portrait / illustration treatment.

**Never use for a living figure:** social-media or YouTube grabs, unlicensed "editorial" stock, or AI-generated likenesses.

---

## 4. Draw what you can't (or shouldn't) download
A large part of the backlog is **pure geometry or typographic form**, not a specific historical artwork — uncopyrightable shapes that don't need a source at all. **Recreate these as original SVG plates** instead of downloading:
- hexagram, sun-cross, pentagram (clean diagram), inverted pentagram, golden-ratio / spiral, vesica piscis, letter-G, checkerboard floor, and similar constructed marks.
- Render as ink-on-transparent line art at the standard plate ratio, tonally neutral so the Phase-F duotone applies cleanly. Mark `status: svg`, `license: "original-cc0"`, `credit: "Original diagram — ANAMNESIS"`.
This clears roughly half the no-PD-raster backlog with **zero downloads, zero licensing risk**, and better visual consistency than scrounged scans. Prefer SVG recreation for any geometric/diagrammatic symbol even when a raster exists.

**SVG recreation is symbol-dictionary entries ONLY.** A figure needs a real portrait, a timeline node a real documentary image, a casebook decode the actual artifact, a pillar a real plate — never substitute a diagram for these. For every non-symbol collection, **exhaust the full multi-host search first** (alternate search terms, related PD depictions, every host in §3) before an entry goes to backlog. SVG is never a fallback outside symbols.

---

## 5. Exclusions & trademarks (unchanged, restated)
- **Live corporate logos** (Apple, Starbucks, CBS, etc.) — purpose decides it:
  - **On casebook decode pages** (the page analyzes/criticizes the mark): show the **actual logo, used as the analysis** — annotated, exploded, marked up — alongside its public-domain **antecedent**. This is commentary/criticism (nominative + fair use), the strongest posture, and a better decode than a bare repro. Minimum-necessary resolution, kept in the editorial decode frame. Credit honestly: `license: "trademark-commentary"`, `plate_credit` = e.g. "Trademark of <company>; shown for commentary & criticism" — never claim a free license. `status: downloaded`.
  - **Everywhere else** (a plain corporate-symbol dictionary entry, decoration, headers): **no trademark use** — antecedent image only, or backlog. Decorative use is the weak case; don't.
  - **Recreating/redrawing a logo does not avoid copyright or trademark** and hurts decode accuracy — use the real mark, annotated, in the decode context.
  - Not legal advice; fair use is a defense, not a guarantee. If a specific mark feels high-risk, flag it rather than guess.
- **Dangerous-history imagery** (e.g. black-sun, Nazi-era material): documentation is *not* glorification — but the site's advocacy/fascination voice is not automatically encyclopedic, so the framing is what makes the difference, not the public-domain status of the file. These are **deferred** (`status: deferred-documentary`), included only once the entry adopts a plainly **documentary register**: what it is, who used it, what it meant, and **how it is used today**, stated neutrally, with the image as documentation under that frame — not aestheticized. The Nazi-spectacle/propaganda material is on-thesis (a regime engineering mass image-power) and the easiest to frame; the black-sun is the hardest and needs explicit present-day-use context. Until the documentary pass, the neutral fallback renders.
- **Unconditional, never subject to any exception:** nothing sexualizing minors.
- Anything whose license can't be verified PD/CC0/CC-BY(-SA): `status: backlog`, never ship on a guess.

---

## 6. Run order, pacing budget, acceptance
- **Order:** figures → pillars → timeline → casebook (symbols are done). Within each, go in category/section batches.
- **Budget:** keep total throughput modest (≈1 req/host/1–2 s). If a host 429s twice after honoring `Retry-After`, stop that host for the run and continue others; resume later.
- **If 429s persist across all hosts:** the executing IP (a shared/datacenter session) is likely the problem — run **Pass B from a local/residential machine**, which has a cleaner per-IP reputation. Pass A (manifest) can stay wherever.
- **Per batch:** validate licenses present, plates wired via `image()`, credit line rendered, alt text set; `npm run build` clean. Commit `feat(images): <collection>/<category> plates + credits`.
- **Acceptance (Phase E close):** every entry is `downloaded` or `svg`, or explicitly `backlog`/`excluded` in `docs/IMAGE_BACKLOG.md` with a reason. No silent gaps.

---

## 7. Subject-aware crop & QA pass (end of E, before F and G)
After all plates are sourced, run one automated crop + verification pass — open-source Python, local. It runs before Design/Motion because the duotone and choreography are tuned to the final framed plate.
- **Portraits (figures):** detect the face (MediaPipe Face Detection or OpenCV DNN/RetinaFace); crop to the target ratio with headroom so the face sits in the upper third and is never clipped.
- **Non-portraits (engravings, artifacts):** saliency smart-crop (`smartcrop.py` or OpenCV saliency) to keep the important region.
- **Verification (the QA half):** flag any plate where no face is found in a portrait, or the subject touches a crop edge, into a report for manual review — don't silently ship a bad crop.
- **Non-destructive:** keep full-size originals in `src/assets/plates/_originals/`; the pass writes the cropped/optimized WebP derivatives, so re-cropping never loses the source.
- Stack: `opencv-python` + `mediapipe` + `smartcrop` + `Pillow`.

## 8. What stays in the backlog file
`docs/IMAGE_BACKLOG.md` tracks every `backlog`/`excluded` entry with: slug, reason (no clean PD raster / trademark / ethics), and the best lead found. The neutral `.u-plate-fallback` hatch renders for these until resolved — never a seed repeat (post-E5), never a broken image.
