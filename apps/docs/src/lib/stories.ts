/**
 * Reads both Storybooks at build time, so every example on the site is a story
 * that already passes the Storybook checks. React stories run as islands
 * (components/StoryStage.tsx); Astro stories render natively
 * (components/AstroStory.astro).
 */

type Module = Record<string, any>;

const reactModules = import.meta.glob<Module>(
  "../../../storybook/stories/*.stories.tsx",
);
const reactSources = import.meta.glob<string>(
  "../../../storybook/stories/*.stories.tsx",
  {
    query: "?raw",
    import: "default",
  },
);
const astroModules = import.meta.glob<Module>(
  "../../../storybook-astro/stories/*.stories.ts",
);
const astroSources = import.meta.glob<string>(
  "../../../storybook-astro/stories/*.stories.ts",
  {
    query: "?raw",
    import: "default",
  },
);

export interface StoryRef {
  /** Export name, e.g. `PrimaryFill`. */
  id: string;
  /** "Primary fill" */
  title: string;
  /** Written above the story, when it says something useful. */
  description?: string;
  code: string;
  lang: "tsx" | "astro";
}

export interface StoryFile {
  stack: "react" | "astro";
  file: string;
  /** The Storybook title, e.g. `Core/Button`. */
  storyTitle: string;
  stories: StoryRef[];
  fullscreen: boolean;
}

const fileName = (path: string) =>
  path
    .split("/")
    .pop()!
    .replace(/\.stories\.tsx?$/, "");

/** Stories that only re-show the theme or density: the conditions bar does that now. */
const CONDITION_STORY = /(Dark|DarkTheme|DarkMode|Compact|CompactDensity)$/;

function humanise(id: string) {
  const words = id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase();
  const title = words
    .replace(/ light$/, "")
    .replace(/\bftds\b/g, "FTDS")
    .replace(/\bbahasa melayu\b/g, "Bahasa Melayu")
    .replace(/\benglish\b/g, "English")
    .replace(/\bmalay\b/g, "Malay");
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/** In source order: a module's own keys come back sorted alphabetically. */
function storyList(mod: Module, source: string) {
  const order = [...source.matchAll(/^export const (\w+)/gm)].map((m) => m[1]);
  return order.filter(
    (key) =>
      !key.startsWith("__") &&
      typeof mod[key] === "object" &&
      mod[key] !== null &&
      !CONDITION_STORY.test(key),
  );
}

/** The doc comment directly above `export const Name`. */
function docComment(source: string, id: string): string | undefined {
  const match = source.match(
    new RegExp(`/\\*\\*((?:(?!\\*/)[\\s\\S])*)\\*/\\s*export const ${id}\\b`),
  );
  if (!match) return undefined;
  const text = match[1]
    .replace(/^\s*\* ?/gm, "")
    .trim()
    .split("\n\n")[0]
    .replace(/\n/g, " ");
  // Boilerplate from the first batch of stories says nothing the title doesn't
  return /^This story represents|Source: packages/.test(text)
    ? undefined
    : text;
}

/** Find `name`'s definition and return it, matching braces and parens. */
function definition(source: string, name: string): string | undefined {
  const start = source.search(
    new RegExp(`^(export )?(function ${name}\\b|const ${name}\\b)`, "m"),
  );
  if (start < 0) return undefined;
  let depth = 0;
  let seen = false;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if ("({[".includes(c)) {
      depth++;
      seen = true;
    }
    if (")}]".includes(c)) depth--;
    if (seen && depth === 0 && (c === "}" || c === ")" || c === ";")) {
      if (source[i + 1] === ";") i++;
      const next = source.slice(i + 1).match(/^\s*(\S)/)?.[1];
      if (next && ".?=".includes(next)) continue;
      return source.slice(start, i + 1).replace(/^export /, "");
    }
  }
  return undefined;
}

// JSX from args. Handles what stories use: strings, numbers, booleans, simple
// objects and React elements. Functions (Storybook actions) are left out.

function elementName(type: any): string {
  if (typeof type === "string") return type;
  if (typeof type === "symbol") return "";
  return type?.displayName ?? type?.name ?? "Component";
}

function prop(key: string, value: unknown): string | undefined {
  if (key === "children" || value === undefined || typeof value === "function")
    return undefined;
  if (value === true) return key;
  if (typeof value === "string") return `${key}=${JSON.stringify(value)}`;
  if (typeof value === "object" && value && "$$typeof" in value)
    return `${key}={${jsx(value as any)}}`;
  return `${key}={${JSON.stringify(value)}}`;
}

function jsx(node: any, indent = ""): string {
  if (node === null || node === undefined || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node))
    return node
      .map((n) => jsx(n, indent))
      .filter(Boolean)
      .join(`\n${indent}`);
  if (typeof node === "object" && "$$typeof" in node) {
    const name = elementName(node.type);
    const inner = jsx(node.props.children, `${indent}  `);
    if (!name) return inner;
    const props = Object.entries(node.props)
      .map(([k, v]) => prop(k, v))
      .filter(Boolean)
      .join(" ");
    const open = props ? `${name} ${props}` : name;
    if (!inner) return `<${open} />`;
    return inner.includes("\n") || inner.length > 48
      ? `<${open}>\n${indent}  ${inner}\n${indent}</${name}>`
      : `<${open}>${inner}</${name}>`;
  }
  return String(node);
}

const mapped = (meta: any, story: any, args: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(args).map(([key, value]) => {
      const mapping =
        story.argTypes?.[key]?.mapping ?? meta.argTypes?.[key]?.mapping;
      return [
        key,
        mapping && (value as any) in mapping ? mapping[value as any] : value,
      ];
    }),
  );

const importLine = (source: string, name?: string) => {
  if (!name) return "";
  const line = source.match(
    new RegExp(
      `import\\s+(?:\\{[^}]*\\b${name}\\b[^}]*\\}|${name})\\s+from\\s+"([^"]+)";`,
    ),
  );
  if (!line) return "";
  return line[0].replace(
    /"@mof-malaysia\/ftds-react\/([\w-]+)"/,
    '"@/components/ui/$1"',
  );
};

/** Keep the source's imports that `code` uses, rewritten the way a project writes them. */
function importsFor(code: string, source: string): string {
  const lines: string[] = [];
  for (const [statement, names, path] of source.matchAll(
    /^import\s+(?!type\b)([\s\S]*?)\s+from\s+"([^"]+)";$/gm,
  )) {
    if (/storybook|^react$|\.\.\/utils/.test(path)) continue;
    const bound = names
      .replace(/[{}]/g, " ")
      .split(/[\s,]+/)
      .filter((n) => n && n !== "as");
    const used = bound.filter((name) => new RegExp(`\\b${name}\\b`).test(code));
    if (!used.length) continue;
    lines.push(
      statement
        .replace(/"@mof-malaysia\/ftds-react\/icon"/, '"@/components/ui/icons"')
        .replace(
          /"@mof-malaysia\/ftds-react\/([\w-]+)"/,
          '"@/components/ui/$1"',
        )
        .replace(/"\.\.\/react\/([\w-]+)"/, '"@/components/ui/icons/$1"'),
    );
  }
  return lines.length ? `${lines.join("\n")}\n\n` : "";
}

function reactCode(source: string, mod: Module, id: string): string {
  const meta = mod.default ?? {};
  const story = mod[id];
  const start = source.search(new RegExp(`^export const ${id}\\b`, "m"));
  const rest = source.slice(start);
  const end = rest.slice(1).search(/^(\/\*\*|export const )/m);
  const block = end > 0 ? rest.slice(0, end + 1) : rest;

  // createRender(Name), createRender(() => <Name />), render: Name, render: () => <Name />
  const named =
    block.match(/createRender\(\s*(?:\([^)]*\)\s*=>\s*<)?(\w+)/)?.[1] ??
    block.match(/render:\s*(?:\([^)]*\)\s*=>\s*<)?([A-Z]\w*)/)?.[1];
  if (named) {
    const body = definition(source, named);
    if (body) return importsFor(body, source) + body;
  }

  if (story.render || meta.render) {
    // An inline render function: show what it returns
    const inline = block.match(
      /render:\s*(?:function\s*)?\([^)]*\)\s*(?:=>|\{)\s*([\s\S]*?)\s*,?\s*\};?\s*$/,
    )?.[1];
    if (inline && !/args|createRender|\bfn\(/.test(inline)) {
      const body = inline
        .replace(/^\(\s*/, "")
        .replace(/\s*\)\s*$/, "")
        .replace(/^return\s+/, "");
      return importsFor(body, source) + body;
    }
    return "";
  }

  const component = meta.component;
  if (!component) return "";
  const args = mapped(meta, story, { ...meta.args, ...story.args });
  const name = elementName(component);
  const element = {
    $$typeof: Symbol.for("react.element"),
    type: { displayName: name },
    props: args,
  };
  return [importLine(source, name), jsx(element)]
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function astroCode(source: string, mod: Module, id: string): string {
  const meta = mod.default ?? {};
  const story = mod[id];
  const { slots = {}, ...props } = { ...meta.args, ...story.args } as Record<
    string,
    any
  >;
  const name = componentIdentifier(source);
  const attrs = Object.entries(props)
    .map(([k, v]) => prop(k, v))
    .filter(Boolean) as string[];
  const open =
    attrs.length > 2 || attrs.join(" ").length > 56
      ? `${name}\n  ${attrs.join("\n  ")}\n`
      : attrs.length
        ? `${name} ${attrs.join(" ")}`
        : name;
  const entries = Object.entries(slots) as [string, string][];
  const body = entries
    .map(([slot, html]) =>
      slot === "default" ? html : html.replace(/^<(\w+)/, `<$1 slot="${slot}"`),
    )
    .join("\n");
  const element = body
    ? body.includes("\n") || body.length > 48
      ? `<${open}>\n  ${body.replace(/\n/g, "\n  ")}\n</${name}>`
      : `<${open}>${body}</${name}>`
    : `<${open} />`;
  const line = importLine(source, name);
  // Sample images are data URIs in the stories; nobody wants to read those
  const code = element.replace(/data:[^"'\\s)]+/g, "/logo.svg");
  return line ? `---\n${line}\n---\n\n${code}` : code;
}

function componentIdentifier(source: string) {
  return source.match(/component:\s*(\w+)/)?.[1] ?? "Component";
}

async function read(
  stack: "react" | "astro",
  modules: Record<string, () => Promise<Module>>,
  sources: Record<string, () => Promise<string>>,
): Promise<Map<string, StoryFile>> {
  const files = new Map<string, StoryFile>();
  await Promise.all(
    Object.keys(modules).map(async (file) => {
      let mod: Module;
      let source: string;
      try {
        [mod, source] = await Promise.all([modules[file](), sources[file]()]);
      } catch (error) {
        console.warn(`[docs] skipped ${file}:`, (error as Error).message);
        return;
      }
      const meta = mod.default ?? {};
      const stories = storyList(mod, source).map((id) => ({
        id,
        title: humanise(id),
        description: docComment(source, id),
        code:
          stack === "react"
            ? reactCode(source, mod, id)
            : astroCode(source, mod, id),
        lang: stack === "react" ? ("tsx" as const) : ("astro" as const),
      }));
      // Stories that differ only by data generate the same code: show it once.
      // Code that still leans on Storybook's helpers is no use to paste.
      const seen = new Set<string>();
      for (const story of stories) {
        if (
          /createStory|createRender|\bStory\b|\bfn\(\)/.test(story.code) ||
          seen.has(story.code)
        )
          story.code = "";
        else seen.add(story.code);
      }
      files.set(fileName(file), {
        stack,
        file,
        storyTitle: meta.title ?? fileName(file),
        stories,
        fullscreen: meta.parameters?.layout === "fullscreen",
      });
    }),
  );
  return files;
}

let cache:
  | Promise<{ react: Map<string, StoryFile>; astro: Map<string, StoryFile> }>
  | undefined;

export function loadStories() {
  cache ??= Promise.all([
    read("react", reactModules, reactSources),
    read("astro", astroModules, astroSources),
  ]).then(([react, astro]) => ({ react, astro }));
  return cache;
}

/** The module for one Astro story, for rendering it. */
export function astroStoryModule(file: string): Promise<Module> {
  return astroModules[file]();
}

/** Storybook's own URL for a story: `Core/Button` + `PrimaryFill`. */
export function storyId(title: string, id: string) {
  const kebab = (s: string) =>
    s
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[\s/_]+/g, "-")
      .toLowerCase();
  return `${kebab(title)}--${kebab(id)}`;
}
