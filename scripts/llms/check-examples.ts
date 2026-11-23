import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify, stripVTControlCharacters } from "util";
import {
  examples,
  readGuides,
  readItems,
  readSkills,
  rel,
  ROOT_DIR,
  type Doc,
  type Item,
} from "./content";

/**
 * Typecheck every example in the component docs, guides and agent skill against the real
 * source, with the import paths a project has after `shadcn add`:
 *
 *   ```tsx     React docs and guides, with tsc   (@/components/ui/button, @/lib/ftds/utils, ...)
 *   ```astro   Astro docs, with `astro check`    (@/components/ui/button.astro, @/lib/ftds/i18n, ...)
 *
 * Examples must be complete modules: a tsx example has its imports and at
 * least one exported component; an astro example is a whole .astro file, with
 * its imports in the frontmatter.
 *
 * Usage: tsx scripts/llms/check-examples.ts [--only button,astro-button,guide-forms]
 */

const args = process.argv.slice(2);
const only = args.includes("--only")
  ? new Set(
      args[args.indexOf("--only") + 1]?.split(",").map((name) => name.trim()),
    )
  : undefined;
// One folder per run and stack, so several checks can run at once
const REACT_DIR = path.join(
  ROOT_DIR,
  "packages/react/.llms-check",
  String(process.pid),
);
const ASTRO_PACKAGE = path.join(ROOT_DIR, "packages/astro");
const ASTRO_DIR = path.join(ASTRO_PACKAGE, ".llms-check", String(process.pid));
const TSC = path.join(ROOT_DIR, "node_modules/.bin/tsc");
const ASTRO = path.join(ASTRO_PACKAGE, "node_modules/.bin/astro");

interface Source {
  name: string;
  doc: Doc;
  lang: "tsx" | "astro";
}

/** Each example written to <dir>/examples, mapped back to its doc. */
function writeExamples(dir: string, sources: Source[]): Map<string, string> {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "examples"), { recursive: true });
  const origin = new Map<string, string>();
  for (const { name, doc, lang } of sources) {
    examples(doc.body, lang).forEach((code, index) => {
      const file = `examples/${name}--${index + 1}.${lang}`;
      fs.writeFileSync(path.join(dir, file), code);
      origin.set(file, `${rel(doc.file)} (example ${index + 1})`);
    });
  }
  if (!origin.size) fs.rmSync(dir, { recursive: true, force: true });
  return origin;
}

const execFileAsync = promisify(execFile);

/** How many examples a checker saw, and its errors. */
interface Result {
  count: number;
  errors: string[];
}

/** Run a checker; its errors as "doc (example n) (line,col): message" lines. */
async function run(
  command: string,
  commandArgs: string[],
  dir: string,
  origin: Map<string, string>,
  parse: (
    line: string,
  ) => { file: string; location: string; message: string } | undefined,
): Promise<Result> {
  try {
    await execFileAsync(command, commandArgs, { cwd: dir });
    return { count: origin.size, errors: [] };
  } catch (error) {
    // astro check colours its output even when piped
    const output = stripVTControlCharacters(
      String((error as { stdout?: string }).stdout ?? error),
    );
    const errors = output.split("\n").flatMap((line) => {
      const parsed = parse(line);
      return parsed
        ? [
            `${origin.get(parsed.file) ?? parsed.file} ${parsed.location}: ${parsed.message}`,
          ]
        : [];
    });
    return { count: origin.size, errors: errors.length ? errors : [output] };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function pathsFor(items: Item[]): Record<string, string[]> {
  const fromCheckDir = (file: string) => path.relative(REACT_DIR, file);
  const src = path.join(ROOT_DIR, "packages/react/src");
  const paths: Record<string, string[]> = {
    "@/components/ui/icons/*": [fromCheckDir(path.join(src, "icons/*"))],
    "@/lib/ftds/utils": [fromCheckDir(path.join(src, "utils/index.ts"))],
    "@/lib/ftds/utils/*": [fromCheckDir(path.join(src, "utils/*"))],
    "@/lib/ftds/hooks": [fromCheckDir(path.join(src, "hooks/index.ts"))],
    "@/lib/ftds/hooks/*": [fromCheckDir(path.join(src, "hooks/*"))],
  };
  for (const item of items) {
    if (item.importPath.startsWith("@/lib/")) continue;
    paths[item.importPath] = [fromCheckDir(item.sourceFile)];
  }
  return paths;
}

async function checkReact(sources: Source[], items: Item[]): Promise<Result> {
  const origin = writeExamples(REACT_DIR, sources);
  if (!origin.size) return { count: 0, errors: [] };
  fs.writeFileSync(
    path.join(REACT_DIR, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "Bundler",
          moduleDetection: "force",
          jsx: "react-jsx",
          strict: true,
          noUncheckedIndexedAccess: true,
          isolatedModules: true,
          skipLibCheck: true,
          noEmit: true,
          paths: pathsFor(items.filter((item) => item.framework === "react")),
        },
        include: ["examples"],
      },
      null,
      2,
    ),
  );
  // examples/button--1.tsx(3,10): error TS2305: ...
  return run(
    TSC,
    ["-p", REACT_DIR, "--pretty", "false"],
    REACT_DIR,
    origin,
    (line) =>
      line.startsWith("examples/")
        ? {
            file: line.slice(0, line.indexOf("(")),
            location: line.slice(line.indexOf("("), line.indexOf(")") + 1),
            message: line.slice(line.indexOf(":") + 1).trim(),
          }
        : undefined,
  );
}

/** The package's own paths (packages/astro/tsconfig.json), seen from the check folder. */
function astroPaths(): Record<string, string[]> {
  const { compilerOptions } = JSON.parse(
    fs.readFileSync(path.join(ASTRO_PACKAGE, "tsconfig.json"), "utf-8"),
  ) as { compilerOptions: { paths: Record<string, string[]> } };
  return Object.fromEntries(
    Object.entries(compilerOptions.paths).map(([key, targets]) => [
      key,
      targets.map((target) =>
        path.relative(ASTRO_DIR, path.join(ASTRO_PACKAGE, target)),
      ),
    ]),
  );
}

async function checkAstro(sources: Source[]): Promise<Result> {
  const origin = writeExamples(ASTRO_DIR, sources);
  if (!origin.size) return { count: 0, errors: [] };
  fs.writeFileSync(
    path.join(ASTRO_DIR, "tsconfig.json"),
    JSON.stringify(
      {
        extends: "astro/tsconfigs/strict",
        include: ["examples"],
        compilerOptions: { paths: astroPaths() },
      },
      null,
      2,
    ),
  );
  // examples/astro-button--1.astro:8:6 - error ts(2322): ...
  return run(
    ASTRO,
    ["check", "--root", ".", "--minimumSeverity", "error"],
    ASTRO_DIR,
    origin,
    (line) => {
      const match = line.match(
        /^(examples\/\S+\.astro):(\d+):(\d+) - error (.*)$/,
      );
      return match
        ? {
            file: match[1]!,
            location: `(${match[2]},${match[3]})`,
            message: match[4]!,
          }
        : undefined;
    },
  );
}

async function main() {
  const items = readItems();
  const sources: Source[] = [
    ...items.flatMap((item) =>
      item.doc
        ? [
            {
              name: item.entry.name,
              doc: item.doc,
              lang: item.exampleLang,
            },
          ]
        : [],
    ),
    ...readGuides().map((guide) => ({
      name: `guide-${guide.slug}`,
      doc: guide,
      lang: "tsx" as const,
    })),
    // Skill docs by their tsx fences; code files (picker.tsx.txt, shipped as
    // .txt so a project's tooling skips them) as whole files
    ...readSkills().map(({ path: skillPath, file, text }) => {
      const ext = path.extname(file.replace(/\.txt$/, "")).slice(1);
      const lang = ext === "astro" ? ("astro" as const) : ("tsx" as const);
      const body = ext === "md" ? text : `\`\`\`${lang}\n${text}\`\`\`\n`;
      return {
        name: `skill-${skillPath.replace(/(\.\w+)+$/, "").replaceAll("/", "-")}-${ext}`,
        doc: { file, title: skillPath, description: "", body },
        lang,
      };
    }),
  ].filter(({ name }) => !only || only.has(name));
  // Separate folders, so tsc and astro check run at once
  const [react, astro] = await Promise.all([
    checkReact(
      sources.filter((source) => source.lang === "tsx"),
      items,
    ),
    checkAstro(sources.filter((source) => source.lang === "astro")),
  ]);
  const errors = [...react.errors, ...astro.errors];
  const total = `${react.count} tsx and ${astro.count} astro doc examples`;
  if (errors.length) {
    console.error(errors.join("\n"));
    console.error(`\n❌ ${errors.length} type errors in ${total}`);
    process.exitCode = 1;
    return;
  }
  console.log(`✅ ${total} typecheck`);
}

void main();
