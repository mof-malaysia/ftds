import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  ROOT_DIR,
  currentTag,
  readGuides,
  readItems,
  siteUrl,
} from "../../../scripts/llms/content";
import { readExports } from "../../../scripts/llms/api";
import {
  getIconExportMap,
  iconItemName,
} from "../../../scripts/registry/utils";
import type { Catalogue } from "../src/shared/catalogue";

/**
 * Build the catalogue the MCP tools serve, from the same llms.txt build coding
 * agents read on the docs site (scripts/llms), so the two never disagree:
 *
 *   intro       llms.txt up to the guides: what FTDS is and the rules
 *   sections    the component index, by category, React then Astro
 *   pages       components/<name>.md for every component, block and helper
 *   guides      guides/<slug>.md
 *   icons       every icon and its export
 *   modules     import path → export names, read with the TypeScript checker,
 *               for checking a screen's imports
 *   items       import path → registry item, for `shadcn add`
 *
 * Sections and pages carry each item's framework. modules and items are React
 * only: render_screen renders React, and Astro items are documented, not rendered.
 *
 * Writes src/generated/catalogue.json, which the Worker bundles.
 *
 * Usage: tsx scripts/catalogue.cts   (FTDS_SITE_URL and FTDS_VERSION are optional)
 */

const APP_DIR = path.dirname(__dirname);
const LLMS_DIR = path.join(APP_DIR, ".catalogue");
const OUT_FILE = path.join(APP_DIR, "src/generated/catalogue.json");
const ICONS_DIR = path.join(ROOT_DIR, "packages/react/src/icons");
const SITE_URL = siteUrl();
const version = process.env.FTDS_VERSION || currentTag() || "main";

execFileSync(
  "pnpm",
  [
    "exec",
    "tsx",
    "scripts/llms/build.ts",
    "--out",
    LLMS_DIR,
    "--site",
    SITE_URL,
    "--version",
    version,
  ],
  { cwd: ROOT_DIR, stdio: "inherit" },
);

const allItems = readItems();
const reactItems = allItems.filter((item) => item.framework === "react");
const frameworks = new Map(
  allItems.map((item) => [item.entry.name, item.framework]),
);

const read = (file: string) =>
  fs.readFileSync(path.join(LLMS_DIR, file), "utf-8");

const index = read("llms.txt");
const intro = index.slice(0, index.indexOf("\n## ")).trim();

const sections: Catalogue["sections"] = [];
for (const line of index.split("\n")) {
  const heading = line.match(/^## (.+)$/);
  if (heading) {
    sections.push({ category: heading[1]!, items: [] });
    continue;
  }
  const item = line.match(/^- \[.+?\]\(.+?\/components\/([\w-]+)\.md\): (.*)$/);
  const framework = item && frameworks.get(item[1]!);
  if (framework && sections.length) {
    sections.at(-1)!.items.push({
      name: item[1]!,
      description: item[2]!,
      framework,
    });
  }
}

const pages: Catalogue["pages"] = {};
for (const file of fs.readdirSync(path.join(LLMS_DIR, "components"))) {
  const name = file.replace(/\.md$/, "");
  const framework = frameworks.get(name);
  if (framework) pages[name] = { framework, body: read(`components/${file}`) };
}
// Pair each item with its namesake in the other stack: button ↔ astro-button
for (const [name, page] of Object.entries(pages)) {
  const other =
    page.framework === "astro" ? name.replace(/^astro-/, "") : `astro-${name}`;
  if (pages[other])
    page.counterpart = other;
}

// The section index comes from llms.txt above: build.ts groups blocks there
const guides: Catalogue["guides"] = readGuides().map(({ slug, title }) => ({
  slug,
  title,
  body: read(`guides/${slug}.md`),
}));

const modules: Catalogue["modules"] = {};
const items: Catalogue["items"] = {};
for (const item of reactItems) {
  modules[item.importPath] = readExports(item.sourceFile).map((e) => e.name);
  items[item.importPath] = item.entry.name;
}

const icons: Catalogue["icons"] = [];
for (const [exported, file] of getIconExportMap(ICONS_DIR)) {
  const importPath = `@/components/ui/icons/${file}`;
  icons.push({ export: exported, import: importPath });
  modules[importPath] = [exported];
  items[importPath] = iconItemName(file);
}
icons.sort((a, b) => a.import.localeCompare(b.import));

const catalogue: Catalogue = {
  version,
  docsUrl: SITE_URL,
  intro,
  sections: sections.filter((s) => s.items.length),
  pages,
  guides,
  icons,
  modules,
  items,
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(catalogue));
console.log(
  `📦 catalogue ${version}: ${Object.keys(pages).length} pages, ${guides.length} guides, ${icons.length} icons, ${Object.keys(modules).length} modules -> ${path.relative(ROOT_DIR, OUT_FILE)}`,
);
