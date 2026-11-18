import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { REGISTRY_DIR, type RegistryName } from "../registry/utils";
import { CATEGORIES, type Category } from "./categories";

/**
 * Everything the llms.txt build reads: registry items (names, types, install
 * paths, dependencies) from registry/, and the hand-written docs:
 *
 *   packages/react/src/components/<tier>/<name>.md   one per component and block
 *   packages/react/src/{utils,hooks}/<name>.md        the utils and hooks items
 *   packages/astro/src/components/<tier>/<name>.md   one per Astro component and block
 *   packages/astro/src/{i18n,scripts}/<name>.md       the astro-i18n and astro-scripts items
 *   docs/guides/<slug>.md                             guides
 *   docs/llms-intro.md                                the rules at the top of llms.txt
 */

export const ROOT_DIR = path.join(__dirname, "../..");

/** Where the docs are published; hand-written docs link here. */
export const DEFAULT_SITE_URL = "https://mof-malaysia.github.io/ftds";

/** The site to link to: an explicit one, else FTDS_SITE_URL, else the default. */
export function siteUrl(explicit?: string): string {
  return (explicit || process.env.FTDS_SITE_URL || DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  );
}

/** The release tag at HEAD, if HEAD is one (Pages builds from a tag). */
export function currentTag(): string | undefined {
  try {
    return execFileSync(
      "git",
      ["describe", "--tags", "--exact-match", "HEAD"],
      {
        cwd: ROOT_DIR,
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
  } catch {
    return undefined;
  }
}
const REACT_SRC = path.join(ROOT_DIR, "packages/react/src");
const ASTRO_SRC = path.join(ROOT_DIR, "packages/astro/src");
export const GUIDES_DIR = path.join(ROOT_DIR, "docs/guides");
export const INTRO_FILE = path.join(ROOT_DIR, "docs/llms-intro.md");

export { CATEGORIES, type Category };

export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryEntry {
  name: string;
  type: string;
  registry: RegistryName;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

export interface Doc {
  file: string;
  title: string;
  description: string;
  category?: Category;
  order?: number;
  body: string;
}

export type Framework = "react" | "astro";

export interface Item {
  entry: RegistryEntry;
  framework: Framework;
  /** The fence of the examples the checker typechecks: tsx for React, astro for Astro. */
  exampleLang: "tsx" | "astro";
  /** Whether a missing doc fails the build or only warns. */
  docRequired: boolean;
  /** The TypeScript source the item is generated from (first file for hooks). */
  sourceFile: string;
  /** Install path in a project, e.g. components/ui/button.tsx. */
  installPath: string;
  /** Import specifier after install, e.g. @/components/ui/button or @/components/ui/button.astro. */
  importPath: string;
  doc?: Doc;
  docFile: string;
}

const REGISTRIES: RegistryName[] = [
  "core",
  "app",
  "marketing",
  "icons",
  "style",
  "astro-core",
  "astro-marketing",
];

/** Registries whose items have a hand-written doc, and the framework of each. */
const DOCUMENTED: Partial<Record<RegistryName, Framework>> = {
  core: "react",
  app: "react",
  marketing: "react",
  "astro-core": "astro",
  "astro-marketing": "astro",
};

/**
 * Items whose doc may still be missing: a missing one only warns. These are
 * the astro-marketing ui components #28 documents. Whichever of #28 and #29
 * merges last deletes this set and the Item.docRequired field it feeds.
 */
const DOC_PENDING = new Set([
  "astro-accordion",
  "astro-announce-bar",
  "astro-carousel",
  "astro-navbar",
  "astro-navbar-menu",
  "astro-pager",
  "astro-prose",
  "astro-section",
  "astro-section-heading",
  "astro-site-footer",
  "astro-site-search",
]);

/** Astro libs: registry name -> folder under packages/astro/src. */
const ASTRO_LIBS: Record<string, string> = {
  "astro-i18n": "i18n",
  "astro-scripts": "scripts",
};

export function readRegistry(): RegistryEntry[] {
  return REGISTRIES.flatMap((registry) => {
    const { items } = JSON.parse(
      fs.readFileSync(
        path.join(REGISTRY_DIR, registry, "registry.json"),
        "utf-8",
      ),
    ) as { items: Omit<RegistryEntry, "registry">[] };
    return items.map((item) => ({ ...item, registry }));
  });
}

/** Minimal frontmatter: `key: value` lines between `---` fences. */
export function readDoc(file: string): Doc {
  const text = fs.readFileSync(file, "utf-8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${rel(file)}: missing --- frontmatter ---`);
  const fields: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    const field = line.match(/^(\w+):\s*(.*)$/);
    if (!field) throw new Error(`${rel(file)}: bad frontmatter line "${line}"`);
    fields[field[1]!] = field[2]!.replace(/^"(.*)"$/, "$1");
  }
  if (!fields.title || !fields.description) {
    throw new Error(`${rel(file)}: frontmatter needs title and description`);
  }
  const category = fields.category as Category | undefined;
  if (category && !CATEGORIES.includes(category)) {
    throw new Error(
      `${rel(file)}: unknown category "${category}" (one of ${CATEGORIES.join(", ")})`,
    );
  }
  return {
    file,
    title: fields.title,
    description: fields.description,
    category,
    order: fields.order ? Number(fields.order) : undefined,
    body: match[2]!.trim(),
  };
}

export const rel = (file: string) => path.relative(ROOT_DIR, file);

function sourceFor(entry: RegistryEntry): string {
  if (entry.name === "utils") return path.join(REACT_SRC, "utils/index.ts");
  if (entry.name === "hooks") return path.join(REACT_SRC, "hooks/index.ts");
  const lib = ASTRO_LIBS[entry.name];
  if (lib) return path.join(ASTRO_SRC, lib, "index.ts");
  if (entry.registry.startsWith("astro-")) return astroPath(entry, "astro");
  return path.join(
    REACT_SRC,
    "components",
    entry.registry,
    `${entry.name}.tsx`,
  );
}

function docFileFor(entry: RegistryEntry): string {
  if (entry.name === "utils") return path.join(REACT_SRC, "utils/utils.md");
  if (entry.name === "hooks") return path.join(REACT_SRC, "hooks/hooks.md");
  const lib = ASTRO_LIBS[entry.name];
  if (lib) return path.join(ASTRO_SRC, lib, `${lib}.md`);
  if (entry.registry.startsWith("astro-")) return astroPath(entry, "md");
  return path.join(REACT_SRC, "components", entry.registry, `${entry.name}.md`);
}

/** astro-core's astro-button -> packages/astro/src/components/core/button.<ext>. */
const astroPath = (entry: RegistryEntry, ext: string) =>
  path.join(
    ASTRO_SRC,
    "components",
    entry.registry.replace(/^astro-/, ""),
    `${entry.name.replace(/^astro-/, "")}.${ext}`,
  );

function importPathFor(entry: RegistryEntry, installPath: string): string {
  if (entry.name === "utils" || entry.name === "hooks")
    return `@/lib/ftds/${entry.name}`;
  // Astro libs install to lib/ftds/<name>/index.ts
  if (ASTRO_LIBS[entry.name])
    return `@/${installPath.replace(/\/index\.ts$/, "")}`;
  // Astro imports keep the .astro extension
  return `@/${installPath.replace(/\.tsx?$/, "")}`;
}

/** Components, blocks, utils and hooks of both stacks: everything that has a hand-written doc. */
export function readItems(entries = readRegistry()): Item[] {
  return entries.flatMap((entry) => {
    const framework = DOCUMENTED[entry.registry];
    if (!framework) return [];
    const file = entry.files[0]!;
    const installPath = (file.target ?? file.path).replace(/^~\//, "");
    const docFile = docFileFor(entry);
    return [
      {
        entry,
        framework,
        docRequired: !DOC_PENDING.has(entry.name),
        exampleLang: framework === "astro" ? "astro" : "tsx",
        sourceFile: sourceFor(entry),
        installPath,
        importPath: importPathFor(entry, installPath),
        doc: fs.existsSync(docFile) ? readDoc(docFile) : undefined,
        docFile,
      },
    ];
  });
}

export function readGuides(): (Doc & { slug: string })[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      ...readDoc(path.join(GUIDES_DIR, file)),
      slug: file.replace(/\.md$/, ""),
    }))
    .sort(
      (a, b) =>
        (a.order ?? 99) - (b.order ?? 99) || a.slug.localeCompare(b.slug),
    );
}

/** Fenced ```tsx (or ```astro) blocks of a doc body: the examples the checker typechecks. */
export function examples(body: string, lang = "tsx"): string[] {
  return [
    ...body.matchAll(new RegExp(`^\`\`\`${lang}\\n([\\s\\S]*?)^\`\`\`$`, "gm")),
  ].map((m) => m[1]!);
}
