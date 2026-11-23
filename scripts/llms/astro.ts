/**
 * Read the API of an Astro component from its source text: the props its
 * `Props` type declares, their defaults, its slots and the shared cva variants
 * it takes. Plain string parsing with no Node or TypeScript imports.
 */

export interface PropRow {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

/** The text between the brace at `open` and its matching close. */
function braced(source: string, open: number): string {
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) return source.slice(open + 1, i);
  }
  return source.slice(open + 1);
}

/**
 * The object literals of the `Props` declaration: the body of `interface
 * Props`, or each top-level `{ ... }` of `type Props = A & { ... }`, including
 * every branch of a union.
 */
function propsBodies(source: string): string[] {
  const start = source.search(/\b(interface Props\s*\{|type Props\s*=)/);
  if (start < 0) return [];
  if (source.startsWith("interface", start)) {
    return [braced(source, source.indexOf("{", start))];
  }
  const bodies: string[] = [];
  for (let i = source.indexOf("=", start) + 1; i < source.length; i++) {
    if (source[i] === ";") break;
    if (source[i] === "{") {
      const body = braced(source, i);
      bodies.push(body);
      i += body.length + 1;
    }
  }
  return bodies;
}

/**
 * The members of an object type body, split at the `;` (or line break) that
 * ends each one, so inline object and function types stay whole.
 */
function members(body: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const char = body[i]!;
    if (body.startsWith("/**", i)) {
      i = body.indexOf("*/", i) + 1;
      continue;
    }
    if ("{([<".includes(char)) depth++;
    else if ("})]".includes(char) || (char === ">" && body[i - 1] !== "="))
      depth--;
    else if (depth === 0 && char === ";") {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

/** `name = literal` defaults in `const { ... } = Astro.props`. */
export function astroDefaults(source: string): Map<string, string> {
  const defaults = new Map<string, string>();
  const binding = source.match(/const\s*\{([\s\S]*?)\}\s*=\s*Astro\.props/);
  if (!binding) return defaults;
  const matcher =
    /(?:^|,)\s*(\w+)(?:\s*:\s*\w+)?\s*=\s*("[^"]*"|'[^']*'|-?\d+(?:\.\d+)?|true|false)\s*(?=,|$)/g;
  for (const [, name, value] of binding[1]!.matchAll(matcher)) {
    defaults.set(name!, value!.replace(/^'(.*)'$/, '"$1"'));
  }
  return defaults;
}

/** Props declared in an Astro component's `Props` type, with their defaults. */
export function astroProps(source?: string): PropRow[] {
  if (!source) return [];
  const defaults = astroDefaults(source);
  const rows = new Map<string, PropRow>();
  // A prop in several branches of a union (Button's `href`) is optional if
  // any branch makes it so, and typed by the branches that set it
  const optional = new Set<string>();
  const matcher = /^(?:\/\*\*([\s\S]*?)\*\/\s*)?(\w+)(\?)?:\s*([\s\S]+)$/;
  for (const body of propsBodies(source)) {
    for (const member of members(body)) {
      const match = member.match(matcher);
      if (!match) continue;
      const [, doc, name, isOptional, rawType] = match;
      if (isOptional) optional.add(name!);
      const type = rawType!.replace(/\s+/g, " ").trim();
      if (type === "undefined") continue;
      const seen = rows.get(name!);
      if (seen) {
        if (!seen.type.split(" | ").includes(type)) seen.type += ` | ${type}`;
        continue;
      }
      const text = (doc ?? "")
        .replace(/^\s*\*\s?/gm, "")
        .replace(/\n/g, " ")
        .trim();
      rows.set(name!, {
        name: name!,
        type,
        required: true,
        description: text.replace(/\s*@default\s+.*$/, ""),
        defaultValue:
          text.match(/@default\s+(.*)$/)?.[1]?.trim() ?? defaults.get(name!),
      });
    }
  }
  for (const row of rows.values()) row.required = !optional.has(row.name);
  return [...rows.values()];
}

/** The shared cva builders the props take, from `VariantProps<typeof button_cva>`. */
export function astroVariants(
  source: string,
): { name: string; module: string }[] {
  return [...source.matchAll(/VariantProps<typeof (\w+)>/g)].flatMap(
    ([, name]) => {
      const module = source.match(
        new RegExp(
          `import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from\\s*"@mof-malaysia/ftds-style/variants/([\\w-]+)"`,
        ),
      )?.[1];
      return module ? [{ name: name!, module }] : [];
    },
  );
}

/** Slot names in the template: "default" for `<slot />`, else the `name`. */
export function astroSlots(source: string): string[] {
  const slots = new Set<string>();
  for (const [, name] of source.matchAll(/<slot\b(?:\s+name="([\w-]+)")?/g)) {
    slots.add(name ?? "default");
  }
  return [...slots];
}

/** Whether the props include an element's standard attributes (`HTMLAttributes<"a">`). */
export const astroTakesAttributes = (source: string) =>
  /HTMLAttributes</.test(source);

/** The name a component is imported under: button.astro -> Button. */
export const astroComponentName = (file: string) =>
  file
    .replace(/^.*\//, "")
    .replace(/\.astro$/, "")
    .replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
