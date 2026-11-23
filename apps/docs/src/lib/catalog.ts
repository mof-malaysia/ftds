import { getCollection } from "astro:content";
import core from "../../../../registry/core/registry.json";
import app from "../../../../registry/app/registry.json";
import marketing from "../../../../registry/marketing/registry.json";
import astroCore from "../../../../registry/astro-core/registry.json";
import astroMarketing from "../../../../registry/astro-marketing/registry.json";
import { CATEGORIES } from "../../../../scripts/llms/categories";
import { loadStories, type StoryFile } from "./stories";

/**
 * One row per component across both stacks: registry items joined with their
 * stories and their catalogue page.
 */
export interface Entry {
  name: string;
  title: string;
  description: string;
  category: string;
  /** Where it lives: `core`, `app`, or `marketing`. */
  tier: "core" | "app" | "marketing";
  block: boolean;
  react?: { install: string; importLine?: string; stories?: StoryFile };
  astro?: { install: string; stories?: StoryFile };
  /** The id of this item's React page in the `catalogue` collection. */
  page?: string;
  /** The id of this item's Astro page (`astro-<name>`) in the `catalogue` collection. */
  astroPage?: string;
}

const CATEGORY_ORDER: string[] = [...CATEGORIES, "Blocks", "Site blocks"];

const docs = import.meta.glob<string>(
  "../../../../packages/react/src/components/*/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);

const categoryOf = new Map(
  Object.entries(docs).map(([path, text]) => [
    path.split("/").pop()!.replace(/\.md$/, ""),
    text.match(/^category:\s*(.+)$/m)?.[1]?.trim(),
  ]),
);

type Item = (typeof core)["items"][number];
const isComponent = (item: Item) =>
  item.type === "registry:ui" || item.type === "registry:block";

const clean = (title: string) => title.replace(/\s*\(Astro\)$/, "");

let cached: Promise<Entry[]> | undefined;

async function build(): Promise<Entry[]> {
  const stories = await loadStories();
  const pages = new Map(
    (await getCollection("catalogue")).map((p) => [p.id, p]),
  );
  const entries = new Map<string, Entry>();

  for (const [registry, tier] of [
    [core, "core"],
    [app, "app"],
    [marketing, "marketing"],
  ] as const) {
    for (const item of registry.items as Item[]) {
      if (!isComponent(item)) continue;
      const page = pages.get(item.name);
      entries.set(item.name, {
        name: item.name,
        title: clean(item.title ?? item.name),
        description: item.description ?? "",
        category:
          categoryOf.get(item.name) ??
          (item.type === "registry:block"
            ? "Blocks"
            : tier === "marketing"
              ? "Marketing"
              : "Layout"),
        tier,
        block: item.type === "registry:block",
        react: {
          install: `npx shadcn@latest add @ftds/${item.name}`,
          importLine: page?.body?.match(/\*\*Import:\*\*\s*`([^`]+)`/)?.[1],
          stories: stories.react.get(item.name),
        },
        page: page ? item.name : undefined,
      });
    }
  }

  for (const [registry, tier] of [
    [astroCore, "core"],
    [astroMarketing, "marketing"],
  ] as const) {
    for (const item of registry.items as Item[]) {
      if (!isComponent(item)) continue;
      const name = item.name.replace(/^astro-/, "");
      const existing = entries.get(name);
      const astro = {
        install: `npx shadcn@latest add @ftds/${item.name}`,
        stories: stories.astro.get(name),
      };
      const astroPage = pages.has(item.name) ? item.name : undefined;
      if (existing) {
        existing.astro = astro;
        existing.astroPage = astroPage;
      } else {
        entries.set(name, {
          name,
          title: clean(item.title ?? name),
          description: item.description ?? "",
          category: "Site blocks",
          tier,
          block: item.type === "registry:block",
          astro,
          astroPage,
        });
      }
    }
  }

  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c);
    return i < 0 ? CATEGORY_ORDER.length : i;
  };
  return [...entries.values()].sort(
    (a, b) =>
      rank(a.category) - rank(b.category) || a.title.localeCompare(b.title),
  );
}

export function getCatalog() {
  cached ??= build();
  return cached;
}

export async function getCategories() {
  const catalog = await getCatalog();
  const groups = new Map<string, Entry[]>();
  for (const entry of catalog) {
    if (!groups.has(entry.category)) groups.set(entry.category, []);
    groups.get(entry.category)!.push(entry);
  }
  return [...groups].map(([name, entries]) => ({ name, entries }));
}
