// fetch-plates.mjs — Pass B: download every `sourced` manifest record + wire the
// entry's MDX frontmatter. Resumable + paced + Retry-After aware (see
// docs/IMAGE_SOURCING.md). Safe to re-run: files already on disk are skipped;
// a host that 429s twice (after honouring Retry-After) is dropped for this run
// and picked up next time.
//
//   node scripts/fetch-plates.mjs [--collection figures] [--limit N]
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { loadManifest, saveManifest, pacedFetch, exists } from "./plate-sources.mjs";

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith("--collection=")) || "").split("=")[1];
const limit = Number((args.find((a) => a.startsWith("--limit=")) || "").split("=")[1] || Infinity);

// Insert plate + plate_credit after the `glyph:`/`slug:` line. Idempotent.
async function wire(rec) {
  const path = `src/content/${rec.collection}/${rec.slug}.mdx`;
  let text;
  try { text = await readFile(path, "utf8"); } catch { return "(no mdx)"; }
  if (/^plate:\s/m.test(text)) return "(already wired)";
  const lines = text.split("\n");
  let at = lines.findIndex((l) => /^glyph:/.test(l));
  if (at < 0) at = lines.findIndex((l) => /^slug:/.test(l));
  if (at < 0) return "(no anchor)";
  const rel = rec.local_path.replace(/^src\/content\/[^/]+\//, "").startsWith("..")
    ? rec.local_path
    : "../../" + rec.local_path.replace(/^src\//, "");
  const y = [`plate: ${rel}`, `plate_credit:`, `  source: ${JSON.stringify(rec.credit_source)}`];
  if (rec.creator) y.push(`  creator: ${JSON.stringify(rec.creator)}`);
  y.push(`  license: ${JSON.stringify(rec.license)}`);
  if (rec.license_url) y.push(`  license_url: ${JSON.stringify(rec.license_url)}`);
  if (rec.source_url) y.push(`  source_url: ${JSON.stringify(rec.source_url)}`);
  lines.splice(at + 1, 0, ...y);
  await writeFile(path, lines.join("\n"));
  return "wired";
}

const m = await loadManifest();
const recs = Object.values(m).filter((r) => (!only || r.collection === only));
const hostFails = {};
let done = 0, wired = 0, skipped = 0;

for (const rec of recs) {
  if (done >= limit) break;

  // SVG / original diagrams: file authored separately; just wire.
  if (rec.status === "svg") {
    if (await exists(rec.local_path)) { const w = await wire(rec); if (w === "wired") wired++; }
    continue;
  }
  if (rec.status !== "sourced") continue;

  // Already on disk → mark downloaded + wire (resume path).
  if (await exists(rec.local_path)) {
    rec.status = "downloaded"; const w = await wire(rec); if (w === "wired") wired++;
    skipped++; continue;
  }
  if (hostFails[rec.host] >= 2) { continue; } // host dropped for this run

  const r = await pacedFetch(rec.image_url, rec.host, { binary: true });
  if (r.retryAfter || !r.ok) {
    hostFails[rec.host] = (hostFails[rec.host] || 0) + 1;
    console.log(`  ${rec.collection}/${rec.slug}: ${rec.host} failed (${r.status})${hostFails[rec.host] >= 2 ? " — dropping host this run" : " — will retry"}`);
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  await mkdir(dirname(rec.local_path), { recursive: true });
  await writeFile(rec.local_path, buf);
  rec.status = "downloaded";
  const w = await wire(rec);
  if (w === "wired") wired++;
  done++;
  console.log(`✓ ${rec.collection}/${rec.slug}  [${rec.kind}]  ${(buf.length / 1024).toFixed(0)}KB  (${w})`);
}

await saveManifest(m);
const left = recs.filter((r) => r.status === "sourced").length;
console.log(`\nfetched ${done}, wired ${wired}, on-disk ${skipped}; ${left} still 'sourced'${left ? " (re-run to resume)" : ""}.`);
