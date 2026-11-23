#!/usr/bin/env node
/**
 * ftds-check: finds code that breaks the FTDS design rules (DESIGN.md) in a
 * project that uses FTDS. Plain Node, no dependencies, so it runs in any
 * project's pre-commit hook or CI:
 *
 *   node .claude/skills/ftds/scripts/ftds-check.mjs [files or folders…]
 *
 * With no arguments it checks the current folder. It reads .tsx, .jsx, .ts,
 * .js, .mjs, .astro and .mdx files, and skips build output and the FTDS files
 * the shadcn CLI installed (components/ui, lib/ftds, styles/ftds), which are
 * FTDS's own. Prints `file:line  rule  message` per problem and exits 1 if it
 * found any.
 *
 * Colours the project defines itself (`--color-*` in its own CSS, outside
 * FTDS's theme files) take precedence over FTDS's, so their classes are
 * allowed. Run it from the folder with components.json: that's where it
 * looks for the project's CSS.
 *
 * To keep a line it flags, put `ftds-check-ignore` in a comment on that line
 * or the line above, and say why.
 *
 * The rules are in ftds-rules.mjs, beside this file.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, sep } from "node:path";
import { checkSource, definedColours, stackOf } from "./ftds-rules.mjs";

const EXTENSIONS = new Set([
  ".tsx",
  ".jsx",
  ".ts",
  ".js",
  ".mjs",
  ".astro",
  ".mdx",
]);

/** Folders that are build output, dependencies or tooling. */
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".astro",
  ".next",
  ".turbo",
  ".vercel",
  ".claude",
  "dist",
  "build",
  "coverage",
  "storybook-static",
]);

/** Files the shadcn CLI installs from FTDS. Edit them only as FTDS does, so they're not checked. */
const FTDS_OWN = /(?:^|\/)(?:components\/ui|lib\/ftds|styles\/ftds)(?:\/|\.)/;

/**
 * The files under each path with one of `extensions`: folders are walked,
 * files are kept if they match (so a hook can pass every staged file).
 * @param {string[]} paths
 * @param {Set<string>} extensions
 * @returns {string[]}
 */
function collect(paths, extensions) {
  /** @param {string} file */
  const wanted = (file) =>
    extensions.has(extname(file)) &&
    !file.endsWith(".d.ts") &&
    !FTDS_OWN.test(file.split(sep).join("/")) &&
    !file.split(sep).some((part) => SKIP_DIRS.has(part));

  /** @type {string[]} */
  const files = [];
  /** @param {string} dir */
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full);
      } else if (wanted(full)) files.push(full);
    }
  };
  for (const p of paths) {
    const stat = statSync(p, { throwIfNoEntry: false });
    if (!stat) continue;
    if (stat.isDirectory()) walk(p);
    else if (wanted(p)) files.push(p);
  }
  return [...new Set(files)].sort();
}

/**
 * @param {string[]} args
 * @returns {number} the exit code
 */
function main(args) {
  if (args.includes("-h") || args.includes("--help")) {
    console.log(
      "Usage: node ftds-check.mjs [files or folders…]\nChecks for FTDS design-rule breaks. Exits 1 if it finds any.",
    );
    return 0;
  }
  const files = collect(args.length ? args : ["."], EXTENSIONS);
  const colours = new Set(
    collect(["."], new Set([".css"])).flatMap((css) =>
      definedColours(readFileSync(css, "utf-8")),
    ),
  );
  let count = 0;
  for (const file of files) {
    const problems = checkSource(readFileSync(file, "utf-8"), {
      stack: stackOf(file),
      colours,
    });
    for (const p of problems) {
      console.log(
        `${file}:${p.line}  ${p.rule}  ${p.message} Found: ${p.found}`,
      );
    }
    count += problems.length;
  }
  const checked = `${files.length} file${files.length === 1 ? "" : "s"}`;
  if (count) {
    console.log(
      `\nftds-check: ${count} problem${count === 1 ? "" : "s"} in ${checked}. Fix them, or mark a deliberate exception with an ftds-check-ignore comment that says why.`,
    );
    return 1;
  }
  console.log(`ftds-check: ${checked}, no problems.`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
