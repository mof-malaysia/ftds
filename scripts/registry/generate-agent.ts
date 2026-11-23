import { COLOUR_UTILITY, PALETTE } from "../../apps/mcp/src/shared/palette";
import { INTRO_FILE, readDoc, readSkills } from "../llms/content";
import {
  describeItem,
  registryItemRef,
  writeRegistry,
  REGISTRY_ITEM_SCHEMA,
} from "./utils";

/**
 * Generate the agent registry: one `<folder>-skill` item per agent skill in
 * skills/, installed to .claude/skills/<folder>/ in a project. Placeholders in
 * the files are filled so the skills can't drift from the rest of FTDS.
 */

/** Registry metadata per skill folder; `requires` lists other skill folders. */
const SKILLS: Record<
  string,
  { title: string; description: string; requires?: string[] }
> = {
  ftds: {
    title: "FTDS agent skill",
    description:
      "Teaches coding agents to build with FTDS: which docs to read, the smallest step that does the job, the design rules, and how to extend FTDS in a project without breaking its look.",
  },
  "ftds-explore": {
    title: "FTDS explore skill",
    description:
      "Adds /ftds-explore, which builds structurally different working versions of a screen from FTDS behind a picker, to compare, choose from or iterate on.",
    requires: ["ftds"],
  },
};

const PLACEHOLDERS: Record<string, string> = {
  /** The rules at the top of llms.txt. */
  rules: readDoc(INTRO_FILE).body.trim(),
  /**
   * Raw palette colours (`bg-blue-600`, `hover:text-gray-500`) as POSIX ERE,
   * from the playground's checks. grep has no lookbehind, so the utility must
   * start a word: `bg-bg-primary-600` is a token, not `bg-primary-600`.
   */
  palette: `(^|[^[:alnum:]_-])(${COLOUR_UTILITY})-(${PALETTE})-[0-9]{2,3}`,
};

function fill(text: string, file: string): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = PLACEHOLDERS[key];
    if (value === undefined) throw new Error(`Unknown ${match} in ${file}`);
    return value;
  });
}

const files = readSkills();
for (const { skill } of files) {
  if (!SKILLS[skill]) throw new Error(`skills/${skill} has no entry in SKILLS`);
}

const items = Object.entries(SKILLS).map(([skill, meta]) => {
  const own = files.filter((f) => f.skill === skill);
  if (!own.length)
    throw new Error(`SKILLS lists ${skill}, but skills/${skill} is empty`);
  return describeItem(
    {
      $schema: REGISTRY_ITEM_SCHEMA,
      name: `${skill}-skill`,
      type: "registry:file",
      dependencies: [],
      registryDependencies: (meta.requires ?? []).map((name) =>
        registryItemRef(`${name}-skill`),
      ),
      files: own.map(({ path, text }) => ({
        path: `skills/${path}`,
        content: path.endsWith(".md") ? fill(text, path) : text,
        type: "registry:file",
        target: `~/.claude/skills/${path}`,
      })),
    },
    { title: meta.title, description: meta.description, categories: ["agent"] },
  );
});

writeRegistry("agent", items);
console.log(
  `🤖 Generated agent registry: ${items.map((i) => i.name).join(", ")}`,
);
