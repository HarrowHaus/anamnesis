#!/usr/bin/env node
/**
 * ANAMNESIS content validator — runs automatically after Claude Code writes a file.
 * Pure Node (no npm install needed). Scans src/content, enforces the guardrails
 * deterministically, and prints problems so Claude can self-correct.
 *
 * Exit 1 (hard fail) on: missing required frontmatter, missing body sections,
 * or banned skeptic phrasing. Cross-link gaps are warnings (targets may not exist yet).
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const ROOT = "src/content";
const SYMBOL_SECTIONS = ["## Documented origin", "## The reading", "## Where it hides today"];
const REQUIRED = {
  symbols: ["name", "slug", "category", "one_line", "tier", "sources", "seo_title", "seo_description"],
  figures: ["name", "slug", "tier", "sources", "seo_title", "seo_description"],
  casebook: ["title", "slug", "sources", "seo_title", "seo_description"],
  _default: ["slug"],
};
// Skeptic / debunk tells that violate the advocacy stance.
const BANNED = [
  "debunk", "pseudoscience", "pseudo-science", "no credible evidence", "no evidence",
  "conspiracy theory", "conspiracy theories", "discredited", "scholars reject",
  "historians reject", "mainstream historians", "there is no proof", "baseless",
  "unfounded", "skeptic", "fringe theory", "falsely claim", "widely rejected",
];

let errors = 0, warnings = 0, checked = 0;
const allSlugs = new Set();
const links = []; // {file, slug}

function walk(dir) {
  if (!existsSync(dir)) return [];
  let out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if ([".md", ".mdx"].includes(extname(p))) out.push(p);
  }
  return out;
}

function frontmatter(src) {
  if (!src.startsWith("---")) return { fm: "", body: src };
  const end = src.indexOf("\n---", 3);
  if (end === -1) return { fm: "", body: src };
  return { fm: src.slice(3, end), body: src.slice(end + 4) };
}

function collectionOf(file) {
  const parts = file.split(/[\\/]/);
  const i = parts.indexOf("content");
  return i !== -1 && parts[i + 1] ? parts[i + 1] : "_default";
}

// Pass 1: gather every slug so cross-links can be checked.
const files = walk(ROOT);
for (const f of files) {
  const { fm } = frontmatter(readFileSync(f, "utf8"));
  const m = fm.match(/^\s*slug:\s*["']?([a-z0-9-]+)["']?/m);
  if (m) allSlugs.add(m[1]);
}

// Pass 2: validate each file.
for (const f of files) {
  checked++;
  const src = readFileSync(f, "utf8");
  const { fm, body } = frontmatter(src);
  const coll = collectionOf(f);
  const req = REQUIRED[coll] || REQUIRED._default;
  const fmLower = fm.toLowerCase();

  for (const key of req) {
    if (!new RegExp(`^\\s*${key}\\s*:`, "m").test(fm)) {
      console.error(`ERROR  ${f}: missing frontmatter "${key}"`);
      errors++;
    }
  }

  const slugM = fm.match(/^\s*slug:\s*["']?([a-z0-9-]+)["']?/m);
  if (slugM && !basename(f).startsWith(slugM[1])) {
    console.error(`ERROR  ${f}: slug "${slugM[1]}" does not match filename`);
    errors++;
  }

  if (coll === "symbols") {
    for (const sec of SYMBOL_SECTIONS) {
      if (!body.includes(sec)) {
        console.error(`ERROR  ${f}: missing section "${sec}"`);
        errors++;
      }
    }
  }

  const bodyLower = body.toLowerCase();
  for (const phrase of BANNED) {
    if (bodyLower.includes(phrase)) {
      console.error(`ERROR  ${f}: banned skeptic phrasing "${phrase}" — paraphrase in the affirmative, in-tradition voice`);
      errors++;
    }
  }

  for (const field of ["decoded_by", "related_symbols", "appears_in"]) {
    const block = fm.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
    if (block) {
      for (const s of block[1].split(",").map(x => x.trim().replace(/["']/g, "")).filter(Boolean)) {
        links.push({ file: f, field, slug: s });
      }
    }
  }
}

// Cross-link existence (warnings — targets may be generated later).
for (const l of links) {
  if (!allSlugs.has(l.slug)) {
    console.warn(`WARN   ${l.file}: ${l.field} -> "${l.slug}" has no entry yet`);
    warnings++;
  }
}

console.log(`\nANAMNESIS validate: ${checked} files · ${errors} errors · ${warnings} warnings`);
if (errors > 0) {
  console.error("FAIL — fix the errors above before committing.");
  process.exit(1);
}
process.exit(0);
