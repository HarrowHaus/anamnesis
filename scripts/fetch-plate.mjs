// fetch-plate.mjs — Phase E2 plate sourcing + licence gate (Wikimedia Commons).
//
// Usage:
//   node scripts/fetch-plate.mjs <collection> <slug> "File:Some File.jpg" [--width=1600]
//   node scripts/fetch-plate.mjs --search "flammarion engraving" [--n=6]   (discover candidates)
//
// It queries the Commons API for licence metadata, ACCEPTS only public-domain /
// CC0 / CC-BY(-SA) files, downloads a width-capped copy into
// src/assets/plates/<collection>/<slug>.<ext>, and prints the exact frontmatter
// (`plate:` + `plate_credit:`) to paste. Anything else prints SKIP — never
// downloaded. No plate ships without a recorded, verified licence.
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const API = "https://commons.wikimedia.org/w/api.php";
const stripHtml = (s) => (s ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// Licences we will ship (PD/CC0 preferred; CC-BY(-SA) accepted WITH credit).
function classifyLicence(shortName, machine) {
  const s = `${shortName ?? ""} ${machine ?? ""}`.toLowerCase();
  if (/public domain|pd-|cc-pd|cc0|cc 0/.test(s)) return { ok: true, kind: "PD/CC0" };
  if (/cc[ -]by[ -]sa/.test(s)) return { ok: true, kind: "CC-BY-SA" };
  if (/cc[ -]by/.test(s)) return { ok: true, kind: "CC-BY" };
  return { ok: false, kind: shortName || machine || "unknown" };
}

async function api(params) {
  const u = new URL(API);
  Object.entries({ format: "json", origin: "*", ...params }).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u, { headers: { "User-Agent": "ANAMNESIS/plate-sourcing (editorial; contact via repo)" } });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

async function search(term, n) {
  const j = await api({ action: "query", generator: "search", gsrsearch: term, gsrnamespace: "6", gsrlimit: String(n),
    prop: "imageinfo", iiprop: "extmetadata|url|size", iiurlwidth: "320" });
  const pages = Object.values(j.query?.pages ?? {});
  for (const p of pages) {
    const ii = p.imageinfo?.[0]; const m = ii?.extmetadata ?? {};
    const lic = classifyLicence(m.LicenseShortName?.value, m.License?.value);
    console.log(`${lic.ok ? "✓" : "✗"} [${lic.kind}] ${p.title}`);
    console.log(`    creator: ${stripHtml(m.Artist?.value) || "—"}`);
    console.log(`    page:    https://commons.wikimedia.org/?curid=${p.pageid}`);
  }
}

async function fetchOne(collection, slug, fileTitle, width) {
  const title = fileTitle.startsWith("File:") ? fileTitle : `File:${fileTitle}`;
  const j = await api({ action: "query", titles: title, prop: "imageinfo",
    iiprop: "extmetadata|url|size|mime", iiurlwidth: String(width) });
  const page = Object.values(j.query?.pages ?? {})[0];
  if (!page || page.missing !== undefined) { console.log(`SKIP — file not found: ${title}`); return; }
  const ii = page.imageinfo?.[0]; const m = ii?.extmetadata ?? {};
  const shortName = stripHtml(m.LicenseShortName?.value);
  const lic = classifyLicence(shortName, m.License?.value);
  const creator = stripHtml(m.Artist?.value);
  const sourceUrl = ii.descriptionurl || `https://commons.wikimedia.org/?curid=${page.pageid}`;
  const licenseUrl = m.LicenseUrl?.value;

  if (!lic.ok) {
    console.log(`SKIP — licence not shippable: "${shortName || lic.kind}"  (${title})`);
    console.log(`    page: ${sourceUrl}`);
    return;
  }

  const dl = ii.thumburl || ii.url;
  const ext = (dl.split("?")[0].match(/\.(jpe?g|png|webp)$/i)?.[1] || "jpg").toLowerCase().replace("jpeg", "jpg");
  const out = `src/assets/plates/${collection}/${slug}.${ext}`;
  // Wikimedia throttles bursts (429) — back off and retry a few times.
  let bin;
  for (let attempt = 0; attempt < 4; attempt++) {
    bin = await fetch(dl, { headers: { "User-Agent": "ANAMNESIS/plate-sourcing (editorial)" } });
    if (bin.status !== 429) break;
    await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
  }
  if (!bin.ok) { console.log(`SKIP — download failed ${bin.status}: ${dl}`); return; }
  const buf = Buffer.from(await bin.arrayBuffer());
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);

  const licenseLabel = lic.kind === "PD/CC0"
    ? (/cc0/i.test(shortName) ? "CC0" : "Public Domain")
    : shortName || lic.kind;
  const rel = `../../assets/plates/${collection}/${slug}.${ext}`;
  console.log(`\nOK [${lic.kind}] → ${out}  (${(buf.length / 1024).toFixed(0)} KB, ${ii.thumbwidth || ii.width}px)`);
  console.log(`\n--- paste into src/content/${collection}/${slug}.mdx frontmatter ---`);
  console.log(`plate: ${rel}`);
  console.log(`plate_credit:`);
  console.log(`  source: "Wikimedia Commons"`);
  if (creator) console.log(`  creator: ${JSON.stringify(creator.slice(0, 160))}`);
  console.log(`  license: ${JSON.stringify(licenseLabel)}`);
  if (licenseUrl) console.log(`  license_url: "${licenseUrl}"`);
  console.log(`  source_url: "${sourceUrl}"`);
  console.log(`-------------------------------------------------------------`);
}

const args = process.argv.slice(2);
const width = Number((args.find((a) => a.startsWith("--width="))?.split("=")[1]) || 1600);
if (args[0] === "--search") {
  const n = Number((args.find((a) => a.startsWith("--n="))?.split("=")[1]) || 6);
  await search(args[1], n);
} else if (args.length >= 3) {
  await fetchOne(args[0], args[1], args.slice(2).filter((a) => !a.startsWith("--")).join(" "), width);
} else {
  console.log('Usage: node scripts/fetch-plate.mjs <collection> <slug> "File:Name.jpg" | --search "term"');
}
