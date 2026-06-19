// source-plate.mjs — Pass A: search hosts + write/extend data/plate-manifest.json.
// Lightweight metadata calls only (no image download). Idempotent + resumable.
//
//   node scripts/source-plate.mjs search <host> "<term>" [--n=6]
//   node scripts/source-plate.mjs add <collection> <slug> <host> "<ref>"
//   node scripts/source-plate.mjs svg <collection> <slug>
//   node scripts/source-plate.mjs backlog <collection> <slug> "<reason>"
//   node scripts/source-plate.mjs status            (summary)
import { HOSTS, loadManifest, saveManifest, key } from "./plate-sources.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const flag = (n, d) => { const a = rest.find((x) => x.startsWith(`--${n}=`)); return a ? a.split("=")[1] : d; };
const pos = rest.filter((x) => !x.startsWith("--"));

if (cmd === "search") {
  const [host, term] = pos;
  const adapter = HOSTS[host];
  if (!adapter) { console.log(`unknown host: ${host} (have: ${Object.keys(HOSTS).join(", ")})`); process.exit(1); }
  const cands = await adapter.search(term, Number(flag("n", 6)));
  for (const c of cands) console.log(`${c.ok ? "✓" : "✗"} [${c.license}] ${c.ref}\n    ${c.creator || "—"}  ·  ${c.page || ""}`);
  if (!cands.length) console.log("(no candidates)");
} else if (cmd === "add") {
  const [collection, slug, host, ...refParts] = pos;
  const ref = refParts.join(" ");
  const adapter = HOSTS[host];
  if (!adapter) { console.log(`unknown host: ${host}`); process.exit(1); }
  const res = await adapter.resolve(ref);
  if (!res) { console.log(`SKIP — not found on ${host}: ${ref}`); process.exit(0); }
  if (res.rejected) { console.log(`SKIP — licence not shippable (${res.rejected}) ${res.source_url || ""}`); process.exit(0); }
  const m = await loadManifest();
  m[key(collection, slug)] = {
    collection, slug, status: "sourced", host, ref,
    image_url: res.image_url, kind: res.kind, license: res.license, creator: res.creator || undefined,
    credit_source: res.credit_source, source_url: res.source_url, license_url: res.license_url || undefined,
    local_path: `src/assets/plates/${collection}/${slug}.${res.ext}`,
  };
  await saveManifest(m);
  console.log(`sourced [${res.kind}] ${collection}/${slug} ← ${host}:${ref}\n  ${res.image_url}`);
} else if (cmd === "svg") {
  const [collection, slug] = pos;
  const m = await loadManifest();
  m[key(collection, slug)] = {
    collection, slug, status: "svg", host: "original",
    license: "CC0", credit_source: "Original diagram — ANAMNESIS",
    local_path: `src/assets/plates/${collection}/${slug}.svg`,
  };
  await saveManifest(m);
  console.log(`svg ${collection}/${slug} → ${m[key(collection, slug)].local_path}`);
} else if (cmd === "backlog") {
  const [collection, slug, ...reason] = pos;
  const m = await loadManifest();
  m[key(collection, slug)] = { collection, slug, status: "backlog", reason: reason.join(" ") };
  await saveManifest(m);
  console.log(`backlog ${collection}/${slug} — ${reason.join(" ")}`);
} else if (cmd === "status") {
  const m = await loadManifest();
  const by = {};
  for (const r of Object.values(m)) by[r.status] = (by[r.status] || 0) + 1;
  console.log(`manifest: ${Object.keys(m).length} records`, by);
} else {
  console.log("commands: search <host> <term> | add <coll> <slug> <host> <ref> | svg <coll> <slug> | backlog <coll> <slug> <reason> | status");
}
