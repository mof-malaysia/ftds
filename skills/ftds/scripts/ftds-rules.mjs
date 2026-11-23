/**
 * The FTDS design rules (DESIGN.md) that can be read from code, as plain
 * JavaScript with no imports. ftds-check.mjs runs them over a project's
 * files; the FTDS Playground checks screens with them too
 * (apps/mcp/src/shared/check.ts in the FTDS repo imports this file).
 */

/** Tailwind's own colour names. FTDS uses tokens (bg-bg-*, text-txt-*, border-otl-*) instead. */
const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|primary|danger|success|warning";

/** Tailwind utilities that take a colour. */
const COLOUR_UTILITY =
  "bg|text|border|border-[trblxy]|ring|outline|fill|stroke|divide|from|via|to|decoration|accent|caret|placeholder";

/**
 * @typedef {"react" | "astro"} Stack
 * @typedef {{
 *   rule: string;
 *   pattern: RegExp;
 *   message: string;
 *   imports?: boolean;
 *   stack?: Stack;
 * }} Rule
 * A line rule. `imports` rules check import lines, which the others skip;
 * `stack` limits a rule to React or Astro files.
 * @typedef {{ rule: string; line: number; message: string; found: string }} Problem
 */

/** @type {Rule[]} Design rules that can be checked one line at a time. */
const RULES = [
  {
    rule: "tokens",
    pattern: new RegExp(
      `(?<![\\w-])(?:[\\w-]+:)*(?:${COLOUR_UTILITY})-(?:${PALETTE})-\\d{2,3}(?![\\w-])`,
    ),
    message:
      "Raw palette colour. Use FTDS tokens, which switch with dark mode: bg-bg-*, text-txt-*, border-otl-* (e.g. bg-bg-primary-600, text-txt-black-700, bg-bg-washed).",
  },
  {
    rule: "tokens",
    pattern: new RegExp(
      // rgb(var(--token)) refers to a token, so it's allowed
      `(?<![\\w-])(?:${COLOUR_UTILITY})-\\[(?:#|(?:rgb|hsl|oklch)a?\\((?!var\\()|color:(?!var\\())`,
    ),
    message: "Arbitrary colour value. Use an FTDS token instead.",
  },
  {
    rule: "tokens",
    pattern:
      /(?:color|background|backgroundColor|borderColor)\s*:\s*["'`](?:#|rgb|hsl)/,
    message: "Inline colour style. Use an FTDS token class instead.",
  },
  {
    rule: "no-gradients",
    pattern: /(?<![\w-])bg-(?:gradient|linear|radial|conic)-/,
    message:
      "Gradient. FTDS uses flat tone (Paper, Sheet, Well), never gradients.",
  },
  {
    rule: "weights",
    pattern:
      /(?<![\w-])font-(?:thin|extralight|light|bold|extrabold|black)(?![\w-])/,
    message:
      "Font weight outside 400, 500 and 600. Use font-normal, font-medium or font-semibold.",
  },
  {
    rule: "no-side-stripes",
    pattern: /(?<![\w-])border-[ls]-(?:[2-9]|\[)/,
    message:
      "Coloured side stripe. Use a wash background and an icon (e.g. Callout) instead.",
  },
  {
    rule: "flat",
    pattern: /(?<![\w-])shadow(?:-(?:sm|md|lg|xl|2xl))?(?![\w-])/,
    message:
      "Shadow on a static element. Only floating layers (menus, dialogs, popovers) have shadows; separate with tone and spacing.",
  },
  {
    rule: "use-components",
    pattern: /<(button|input|select|textarea|table)[\s>/]/,
    stack: "react",
    message:
      "Hand-built control. Use the FTDS component (Button, Input, Select, Textarea, Table or DataTable) so it gets the right states, density and accessibility.",
  },
  {
    // FTDS Astro has Button but leaves inputs, selects and tables to the platform
    rule: "use-components",
    pattern: /<button[\s>/]/,
    stack: "astro",
    message:
      "Hand-built button. Use the FTDS Button so it gets the right states, density and accessibility.",
  },
  {
    rule: "render-not-aschild",
    pattern: /\basChild\b/,
    stack: "react",
    message:
      'asChild is a Radix/shadcn prop. FTDS components take render instead: <Button render={<a href="…" />}>.',
  },
  {
    rule: "clx-not-cn",
    pattern: /(?<![\w.$])cn\(/,
    message:
      'cn() is shadcn\'s helper. FTDS uses clx() from "@/lib/ftds/utils".',
  },
  {
    rule: "no-primitives",
    // Base UI's utilities (useRender, mergeProps) are fine: FTDS has no version of them
    pattern:
      /(?:\bfrom|\bimport|\brequire)\s*\(?\s*["'](?:@radix-ui\/|@base-ui\/react(?:["']|\/(?!use-render|merge-props|direction-provider|csp-provider)))/,
    imports: true,
    message:
      "Primitive import. Use the FTDS component built on it (see llms.txt), or its parts (FieldItem, DialogClose…): FTDS is built on Base UI, not Radix, and a project component builds on FTDS components.",
  },
];

/** Saturated button variants; one per screen (DESIGN.md, the One Blue Rule). */
const PRIMARY = "primary-fill";

/** @param {string} file */
export const stackOf = (file) => (file.endsWith(".astro") ? "astro" : "react");

/**
 * Every problem in one file's text. `imports: false` leaves out the import
 * rules, for a caller that checks imports itself.
 * @param {string} text
 * @param {{ stack?: Stack; imports?: boolean }} [options]
 * @returns {Problem[]}
 */
export function checkSource(text, { stack = "react", imports = true } = {}) {
  const lines = text.split("\n");
  const marked = text.includes("ftds-check-ignore");
  const ignored = (/** @type {number} */ index) =>
    marked &&
    (lines[index]?.includes("ftds-check-ignore") ||
      lines[index - 1]?.includes("ftds-check-ignore"));

  /** @type {Problem[]} */
  const problems = [];
  lines.forEach((line, index) => {
    if (ignored(index)) return;
    const code = withoutComments(line);
    const isImport = /^\s*import\s/.test(code);
    for (const rule of RULES) {
      if (rule.imports ? !imports : isImport) continue;
      if (rule.stack && rule.stack !== stack) continue;
      const match = code.match(rule.pattern);
      if (match) {
        problems.push({
          rule: rule.rule,
          line: index + 1,
          message: rule.message,
          found: match[0].trim(),
        });
      }
    }
  });

  extraPrimaries(text)
    .filter(({ line }) => !ignored(line - 1))
    .forEach(({ line, found }) =>
      problems.push({
        rule: "one-primary",
        line,
        found,
        message:
          'Second primary button in this file. A screen has one primary action; make the others secondary (variant="default-outline") or ghost.',
      }),
    );

  return problems.sort((a, b) => a.line - b.line);
}

/**
 * A line without its comments, so a comment like "no shadow here" isn't
 * read as code. `//` only counts after a space or at the start, which keeps
 * URLs; JSDoc lines (` * …`) are dropped whole.
 * @param {string} line
 */
function withoutComments(line) {
  if (/^\s*\*(?:\s|\/|$)/.test(line)) return "";
  return line
    .replace(/\{?\/\*.*?\*\/\}?|<!--.*?-->/g, "")
    .replace(/(^|\s)\/\/.*$/, "$1");
}

/**
 * Each `<Button>` that renders as primary after the first under the same
 * `return`. Primary is `variant="primary-fill"`, or no variant (the
 * default); a variant from an expression or a spread can't be known here,
 * so it isn't counted. Buttons under different `return` statements are
 * different states (an early return, or two components in one file).
 * @param {string} text
 * @returns {{ line: number; found: string }[]}
 */
function extraPrimaries(text) {
  const returns = [...text.matchAll(/\breturn\b/g)].map((m) => m.index);
  /** @type {Set<number>} */
  const seen = new Set();
  /** @type {{ line: number; found: string }[]} */
  const found = [];
  // Matches come in order, so count lines as we go rather than from the start
  let line = 1;
  let counted = 0;
  for (const match of text.matchAll(/<Button(?=[\s/>])/g)) {
    const start = /** @type {number} */ (match.index);
    const attrs = openingTag(text, start + match[0].length);
    const literal = attrs.match(
      /\bvariant\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*["'`]([^"'`]*)["'`]\s*\})/,
    );
    if (!literal && /\bvariant\s*=|\{\s*\.\.\./.test(attrs)) continue;
    if (literal && (literal[1] ?? literal[2] ?? literal[3]) !== PRIMARY)
      continue;

    for (; counted < start; counted++) if (text[counted] === "\n") line++;
    const group = returns.findLast((index) => index < start) ?? -1;
    if (seen.has(group)) {
      found.push({
        line,
        found: `<Button${attrs}>`.replace(/\s+/g, " ").slice(0, 80),
      });
    }
    seen.add(group);
  }
  return found;
}

/**
 * The attributes of a JSX or Astro opening tag, up to its closing `>`,
 * skipping over strings and `{…}` expressions (which can hold `>`).
 * @param {string} text
 * @param {number} from
 */
function openingTag(text, from) {
  let depth = 0;
  /** @type {string | undefined} */
  let quote;
  for (let i = from; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === quote) quote = undefined;
    } else if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0) {
      const end = text[i - 1] === "/" ? i - 1 : i;
      return text.slice(from, end);
    }
  }
  return text.slice(from);
}
