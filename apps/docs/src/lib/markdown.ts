import { localiseLinks } from "./url";
import { linkRefs, type Refs } from "./refs";
import { copyIcons } from "./copy-icons";

const copyButton = `<button type="button" data-copy aria-label="Copy code" class="group/copy doc-copy absolute top-2 right-2">${copyIcons}</button>`;

/** Rendered Markdown, with links on this site and copy buttons on code. */
export function finishHtml(html: string, refs: Refs, current?: string): string {
  return linkRefs(localiseLinks(html), refs, current).replace(
    /<pre[^>]*class="astro-code[\s\S]*?<\/pre>/g,
    (pre) => `<div class="code-block">${pre}${copyButton}</div>`,
  );
}

export interface Section {
  id: string;
  label: string;
  html: string;
}

/** Split rendered Markdown at each `h2`. Anything before the first comes back with an empty id. */
export function sectionsOf(html: string): Section[] {
  return html.split(/(?=<h2[\s>])/).map((part) => ({
    id: part.match(/<h2[^>]*\bid="([^"]+)"/)?.[1] ?? "",
    label:
      part
        .match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]
        .replace(/<[^>]+>/g, "")
        .trim() ?? "",
    html: part,
  }));
}

export type StackSection = Section & { for?: "react" | "astro" };

/** The same section from the Astro page, with its ids (and links to them) prefixed `astro-` so they don't clash with React's. */
function asAstro(section: Section): StackSection {
  return {
    id: `astro-${section.id}`,
    label: section.label,
    html: section.html.replace(/ (id="|href="#)/g, " $1astro-"),
    for: "astro",
  };
}

/**
 * Pair a component's React and Astro sections by heading. An identical pair
 * reads for both stacks; otherwise each shows only under its own stack, the
 * Astro copy right after the React one. With one page, its sections read for
 * the stack the page has.
 */
export function pairStackSections(
  react: Section[],
  astro: Section[],
): StackSection[] {
  if (!react.length || !astro.length) return [...react, ...astro];
  const unpaired = new Map(astro.map((s) => [s.label, s]));
  const paired = react.flatMap((r): StackSection[] => {
    const a = unpaired.get(r.label);
    unpaired.delete(r.label);
    if (a?.html === r.html) return [r];
    return [{ ...r, for: "react" }, ...(a ? [asAstro(a)] : [])];
  });
  return [...paired, ...[...unpaired.values()].map(asAstro)];
}

/** A guide page's body: its own title and summary show in the plate instead. */
export function guideBody(html: string): string {
  return html.replace(
    /^\s*<h1[\s\S]*?<\/h1>\s*(<blockquote>[\s\S]*?<\/blockquote>)?/,
    "",
  );
}

/** The one-line summary the catalogue build writes under a guide's title. */
export function guideSummary(body?: string) {
  return body?.match(/^> (.+)$/m)?.[1];
}
