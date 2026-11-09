import { getCollection } from "astro:content";
import { getCatalog } from "~/lib/catalog";
import { foundationLinks, startLinks } from "~/lib/nav";
import { href } from "~/lib/url";
import { guideSummary } from "~/lib/markdown";

/** The index behind ⌘K. Titles and one-line descriptions only, so it stays small. */
export async function GET() {
  const catalog = await getCatalog();
  const guides = await getCollection("guides");
  const describe = (id: string) =>
    guideSummary(guides.find((g) => `start/${g.id}` === id)?.body) ?? "";
  return Response.json([
    ...startLinks.map((l) => ({
      t: l.title,
      d: describe(l.id),
      u: l.href,
      g: "Start",
    })),
    ...foundationLinks.map((l) => ({
      t: l.title,
      d: "",
      u: l.href,
      g: "Foundations",
    })),
    {
      t: "Templates",
      d: "Whole pages to copy from",
      u: href("/templates"),
      g: "More",
    },
    {
      t: "AI assistants",
      d: "Build screens in Claude or ChatGPT, and give coding agents the docs",
      u: href("/mcp"),
      g: "More",
    },
    ...catalog.map((e) => ({
      t: e.title,
      d: e.description,
      u: href(`/components/${e.name}`),
      g: "Components",
    })),
  ]);
}
