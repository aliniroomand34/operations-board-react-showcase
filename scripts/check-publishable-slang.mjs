/**
 * Privacy gate: fail CI when forbidden private-domain slang appears in publishable paths.
 * Glossary meta-docs (PUBLIC_SURFACE, RELEASE_CHECKLIST) are excluded — they document
 * forbidden terms by design. Application source and reviewer-facing copy must stay clean.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const EXCLUDED_RELATIVE = new Set([
  "docs/PUBLIC_SURFACE.md",
  "docs/RELEASE_CHECKLIST.md",
  "scripts/check-publishable-slang.mjs",
]);

const SCAN_ROOTS = ["src", "docs", "README.md", ".env.example", "vercel.json", "netlify.toml"];

const PATTERNS = [
  {
    label: "game/commerce/messaging slang",
    regex:
      /\b(players?|telegram|fut|ea accounts?|god admin|admin mate|customers?|coins)\b/i,
  },
  {
    label: 'inventory unit "pack"',
    regex: /\bpack\b/i,
  },
];

function normalizeRel(filePath) {
  return relative(packageRoot, filePath).split(sep).join("/");
}

function collectFiles(targetPath, files = []) {
  const absolute = join(packageRoot, targetPath);
  let stat;
  try {
    stat = statSync(absolute);
  } catch {
    return files;
  }

  if (stat.isFile()) {
    files.push(absolute);
    return files;
  }

  if (!stat.isDirectory()) {
    return files;
  }

  for (const entry of readdirSync(absolute)) {
    if (entry === "node_modules" || entry === "dist") {
      continue;
    }
    collectFiles(join(targetPath, entry), files);
  }

  return files;
}

function lineMatches(pattern, line) {
  const flags = pattern.regex.flags.includes("g") ? pattern.regex.flags : `${pattern.regex.flags}g`;
  const regex = new RegExp(pattern.regex.source, flags);
  const hits = [];
  let match = regex.exec(line);
  while (match) {
    hits.push(match[0]);
    match = regex.exec(line);
  }
  return hits;
}

const violations = [];

for (const root of SCAN_ROOTS) {
  for (const filePath of collectFiles(root)) {
    const rel = normalizeRel(filePath);
    if (EXCLUDED_RELATIVE.has(rel)) {
      continue;
    }

    const contents = readFileSync(filePath, "utf8");
    const lines = contents.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const pattern of PATTERNS) {
        const hits = lineMatches(pattern, line);
        if (hits.length > 0) {
          violations.push({
            file: rel,
            line: index + 1,
            label: pattern.label,
            hits: [...new Set(hits)],
            excerpt: line.trim().slice(0, 120),
          });
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error("Publishable slang gate failed.\n");
  for (const v of violations) {
    console.error(
      `${v.file}:${v.line} [${v.label}] ${v.hits.join(", ")} — ${v.excerpt}`,
    );
  }
  console.error(
    `\n${violations.length} violation(s). See docs/PUBLIC_SURFACE.md for the anonymization glossary.`,
  );
  process.exit(1);
}

console.log("Publishable slang gate passed (src + reviewer docs; glossary meta-docs excluded).");
