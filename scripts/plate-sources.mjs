// plate-sources.mjs — shared library for the two-pass plate pipeline (E2).
// See docs/IMAGE_SOURCING.md. Compliant UA, Retry-After, per-host pacing,
// sized images via host APIs (never upload.wikimedia.org direct), multi-host.
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname } from "node:path";

export const MANIFEST = "data/plate-manifest.json";
export const UA =
  "AnamnesisImageSourcer/1.0 (https://anamnesis-1yc.pages.dev; https://github.com/HarrowHaus/anamnesis)";

const stripHtml = (s) => (s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
export function cleanCreator(raw) {
  let s = stripHtml(raw);
  s = s.replace(/\b(\w[\w'.-]*)\1\b/g, "$1").replace(/Unknown author/gi, "").replace(/\s+/g, " ").trim();
  s = s.replace(/\.?\s*[nq]\s?\d{6,}.*$/i, "").trim();
  if (/^(unknown|anonymous|anonyme|no machine-readable author)/i.test(s) || s.length < 2) return "";
  return s.slice(0, 160);
}

// Licence allowlist. PD/CC0/PDM preferred; CC-BY(-SA) accepted with credit.
export function classifyLicence(shortName, machine) {
  const s = `${shortName ?? ""} ${machine ?? ""}`.toLowerCase();
  if (/public domain|pd-|pdm|cc-pd|cc0|cc 0/.test(s)) return { ok: true, kind: "PD/CC0" };
  if (/cc[ -]by[ -]sa/.test(s)) return { ok: true, kind: "CC-BY-SA" };
  if (/cc[ -]by/.test(s)) return { ok: true, kind: "CC-BY" };
  return { ok: false, kind: shortName || machine || "unknown" };
}
export function licenceLabel(kind, shortName) {
  if (kind === "PD/CC0") return /cc0/i.test(shortName ?? "") ? "CC0" : "Public Domain";
  return shortName || kind;
}

/* ---- manifest ---- */
export async function loadManifest() {
  try { return JSON.parse(await readFile(MANIFEST, "utf8")); } catch { return {}; }
}
export async function saveManifest(m) {
  await mkdir(dirname(MANIFEST), { recursive: true });
  const ordered = Object.fromEntries(Object.entries(m).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST, JSON.stringify(ordered, null, 2) + "\n");
}
export const key = (c, s) => `${c}/${s}`;
export async function exists(p) { try { await access(p); return true; } catch { return false; } }

/* ---- paced, compliant fetch with Retry-After ---- */
const lastHit = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function pacedFetch(url, host = "default", { binary = false, minGapMs = 1200, jitterMs = 800 } = {}) {
  const gap = minGapMs + Math.floor(Math.random() * jitterMs);
  const since = Date.now() - (lastHit[host] ?? 0);
  if (since < gap) await sleep(gap - since);
  for (let attempt = 0; attempt < 5; attempt++) {
    lastHit[host] = Date.now();
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: binary ? "*/*" : "application/json" } });
    if (r.status === 429 || r.status === 503) {
      const ra = Number(r.headers.get("retry-after"));
      const wait = Number.isFinite(ra) && ra > 0 ? ra * 1000 : Math.min(60000, 4000 * 2 ** attempt);
      if (attempt === 4) return { ok: false, status: r.status, retryAfter: true };
      await sleep(wait);
      continue;
    }
    return r;
  }
  return { ok: false, status: 0 };
}

/* =====================================================================
   Host adapters. Each: search(term, n) -> [{ref,title,license,creator,page}]
                        resolve(ref)    -> {image_url,license,kind,creator,
                                            credit_source,source_url,license_url,ext}
   ===================================================================== */

// --- Wikimedia Commons (via imageinfo API; never upload.* direct) ---
const COMMONS = "https://commons.wikimedia.org/w/api.php";
async function commonsApi(params) {
  const u = new URL(COMMONS);
  Object.entries({ format: "json", origin: "*", ...params }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await pacedFetch(u.toString(), "commons");
  if (!r.ok) throw new Error(`commons ${r.status}`);
  return r.json();
}
export const commons = {
  async search(term, n = 5) {
    const j = await commonsApi({ action: "query", generator: "search", gsrsearch: term, gsrnamespace: "6",
      gsrlimit: String(n), prop: "imageinfo", iiprop: "extmetadata|url", iiurlwidth: "320" });
    return Object.values(j.query?.pages ?? {}).map((p) => {
      const m = p.imageinfo?.[0]?.extmetadata ?? {};
      const lic = classifyLicence(m.LicenseShortName?.value, m.License?.value);
      return { ref: p.title, title: p.title, license: lic.kind, ok: lic.ok,
        creator: cleanCreator(m.Artist?.value), page: p.imageinfo?.[0]?.descriptionurl };
    });
  },
  async resolve(ref, width = 1200) {
    const title = ref.startsWith("File:") ? ref : `File:${ref}`;
    const j = await commonsApi({ action: "query", titles: title, prop: "imageinfo",
      iiprop: "extmetadata|url|mime", iiurlwidth: String(width) });
    const page = Object.values(j.query?.pages ?? {})[0];
    if (!page || page.missing !== undefined) return null;
    const ii = page.imageinfo?.[0]; const m = ii?.extmetadata ?? {};
    const shortName = stripHtml(m.LicenseShortName?.value);
    const lic = classifyLicence(shortName, m.License?.value);
    if (!lic.ok) return { rejected: lic.kind, source_url: ii?.descriptionurl };
    const url = ii.thumburl || ii.url;
    const ext = (url.split("?")[0].match(/\.(jpe?g|png)$/i)?.[1] || "jpg").toLowerCase().replace("jpeg", "jpg");
    const isWell = /wellcome/i.test(`${title} ${stripHtml(m.Credit?.value)} ${stripHtml(m.Attribution?.value)}`);
    return { image_url: url, kind: lic.kind, license: licenceLabel(lic.kind, shortName),
      creator: cleanCreator(m.Artist?.value), credit_source: isWell ? "Wellcome Collection (via Wikimedia Commons)" : "Wikimedia Commons",
      source_url: ii.descriptionurl, license_url: m.LicenseUrl?.value, ext };
  },
};

// --- The Met (CC0, no key) ---
const MET = "https://collectionapi.metmuseum.org/public/collection/v1";
export const met = {
  async search(term, n = 5) {
    const r = await pacedFetch(`${MET}/search?hasImages=true&q=${encodeURIComponent(term)}`, "met");
    if (!r.ok) throw new Error(`met ${r.status}`);
    const ids = (await r.json()).objectIDs?.slice(0, n) ?? [];
    const out = [];
    for (const id of ids) {
      const o = await met._obj(id);
      if (o?.primaryImage) out.push({ ref: String(id), title: o.title, license: o.isPublicDomain ? "PD/CC0" : "—",
        ok: !!o.isPublicDomain, creator: o.artistDisplayName, page: o.objectURL });
    }
    return out;
  },
  async _obj(id) {
    const r = await pacedFetch(`${MET}/objects/${id}`, "met");
    if (!r.ok) return null;
    return r.json();
  },
  async resolve(ref) {
    const o = await met._obj(ref);
    if (!o) return null;
    if (!o.isPublicDomain || !o.primaryImage) return { rejected: "not CC0 / no image", source_url: o?.objectURL };
    const url = o.primaryImage; // images.metmuseum.org, CC0
    const ext = (url.split("?")[0].match(/\.(jpe?g|png)$/i)?.[1] || "jpg").toLowerCase().replace("jpeg", "jpg");
    return { image_url: url, kind: "PD/CC0", license: "CC0", creator: o.artistDisplayName || "",
      credit_source: "The Metropolitan Museum of Art", source_url: o.objectURL,
      license_url: "https://creativecommons.org/publicdomain/zero/1.0/", ext };
  },
};

// --- Art Institute of Chicago (CC0; IIIF) ---
const AIC = "https://api.artic.edu/api/v1";
export const aic = {
  async search(term, n = 5) {
    const u = `${AIC}/artworks/search?q=${encodeURIComponent(term)}&query[term][is_public_domain]=true` +
      `&fields=id,title,image_id,artist_display&limit=${n}`;
    const r = await pacedFetch(u, "aic");
    if (!r.ok) throw new Error(`aic ${r.status}`);
    return ((await r.json()).data ?? []).filter((d) => d.image_id).map((d) => ({
      ref: String(d.id), title: d.title, license: "PD/CC0", ok: true,
      creator: stripHtml(d.artist_display).split("\n")[0], page: `https://www.artic.edu/artworks/${d.id}` }));
  },
  async resolve(ref, width = 1200) {
    const r = await pacedFetch(`${AIC}/artworks/${ref}?fields=id,title,image_id,artist_display,is_public_domain`, "aic");
    if (!r.ok) return null;
    const d = (await r.json()).data;
    if (!d?.is_public_domain || !d.image_id) return { rejected: "not PD / no image" };
    return { image_url: `https://www.artic.edu/iiif/2/${d.image_id}/full/${width},/0/default.jpg`,
      kind: "PD/CC0", license: "CC0", creator: stripHtml(d.artist_display).split("\n")[0],
      credit_source: "Art Institute of Chicago", source_url: `https://www.artic.edu/artworks/${d.id}`,
      license_url: "https://creativecommons.org/publicdomain/zero/1.0/", ext: "jpg" };
  },
};

export const HOSTS = { commons, met, aic };
