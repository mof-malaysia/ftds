import { getCatalog } from "./catalog";
import { href } from "./url";

/**
 * Component references: every export name mapped to the page that documents
 * it, so `ButtonCounter` in a sentence can link to Button.
 */
export type Refs = Map<string, { name: string; href: string }>;

let cached: Promise<Refs> | undefined;

async function build(): Promise<Refs> {
  const refs: Refs = new Map();
  const catalog = await getCatalog();
  const add = (exported: string, name: string) => {
    if (!refs.has(exported))
      refs.set(exported, { name, href: href(`/components/${name}`) });
  };

  for (const entry of catalog) add(entry.title.replace(/\s+/g, ""), entry.name);

  for (const entry of catalog) {
    const names = entry.react?.importLine?.match(/^import \{([^}]+)\}/)?.[1];
    for (const part of names?.split(",") ?? []) {
      const exported = part.trim().split(/\s+as\s+/)[0];
      if (/^[A-Z]/.test(exported)) add(exported, entry.name);
    }
  }
  return refs;
}

export function getRefs() {
  cached ??= build();
  return cached;
}

/** One reference as HTML. On its own page it stays plain, since it would link to itself. */
export function refHtml(label: string, refs: Refs, current?: string) {
  const ref = refs.get(label);
  if (!ref) return undefined;
  return ref.name === current
    ? `<span class="ref">${label}</span>`
    : `<a class="ref" href="${ref.href}">${label}</a>`;
}

/** Turn `<code>ComponentName</code>` into references. Headings lose their code styling. */
export function linkRefs(html: string, refs: Refs, current?: string) {
  return html.replace(
    /<h[1-6][\s\S]*?<\/h[1-6]>|<code>([A-Z][A-Za-z0-9]*)<\/code>/g,
    (match, label) => {
      if (match.startsWith("<h")) return match.replace(/<\/?code>/g, "");
      return refHtml(label, refs, current) ?? match;
    },
  );
}
