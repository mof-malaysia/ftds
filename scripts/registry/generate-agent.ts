import { COLOUR_UTILITY, PALETTE } from "../../apps/mcp/src/shared/palette";
import { INTRO_FILE, SKILL, readDoc, readSkill } from "../llms/content";
import { describeItem, writeRegistry, REGISTRY_ITEM_SCHEMA } from "./utils";

/**
 * Generate the agent registry: the `ftds-skill` item, the agent skill in
 * skills/ftds/, installed to .claude/skills/ftds/ in a project. Two
 * placeholders in SKILL.md are filled so the skill can't drift from the rest
 * of FTDS:
 *   {{rules}}    the body of docs/llms-intro.md, the rules at the top of llms.txt
 *   {{palette}}  a grep -E pattern for raw colours, from the playground's checks
 */

/**
 * Raw palette colours (`bg-blue-600`, `hover:text-gray-500`), as POSIX ERE.
 * grep has no lookbehind, so the utility must start a word: `bg-bg-primary-600`
 * is a token, not `bg-primary-600`.
 */
const palette = `(^|[^[:alnum:]_-])(${COLOUR_UTILITY})-(${PALETTE})-[0-9]{2,3}`;

function fill(text: string): string {
  const placeholders: Record<string, string> = {
    rules: readDoc(INTRO_FILE).body.trim(),
    palette,
  };
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    if (!(key in placeholders)) throw new Error(`Unknown ${match} in ${SKILL}`);
    return placeholders[key]!;
  });
}

writeRegistry("agent", [
  describeItem(
    {
      $schema: REGISTRY_ITEM_SCHEMA,
      name: "ftds-skill",
      type: "registry:file",
      dependencies: [],
      registryDependencies: [],
      files: readSkill().map(({ name, text }) => ({
        path: `${SKILL}/${name}`,
        content: name === "SKILL.md" ? fill(text) : text,
        type: "registry:file",
        target: `~/.claude/${SKILL}/${name}`,
      })),
    },
    {
      title: "FTDS agent skill",
      description:
        "An agent skill, installed to .claude/skills/ftds/, that teaches coding agents to build with FTDS: which docs to read, the smallest step that does the job, the design rules, and how to extend FTDS in a project without breaking its look.",
      categories: ["agent"],
    },
  ),
]);
console.log("🤖 Generated agent registry: ftds-skill");
