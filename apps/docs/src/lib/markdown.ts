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
