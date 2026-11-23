import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkSource } from "../../../../skills/ftds/scripts/ftds-rules.mjs";

/**
 * The checker projects run in their hooks and CI: ftds-rules.mjs holds the
 * rules, ftds-check.mjs is the command. They live in the skill so they
 * install with it, and are tested here because checkRules is built on them.
 */

const SCRIPT = fileURLToPath(
  new URL("../../../../skills/ftds/scripts/ftds-check.mjs", import.meta.url),
);

const run = (...args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf-8" });

const rules = (code: string, stack: "react" | "astro" = "react") =>
  checkSource(code, { stack }).map((p) => p.rule);

test("the design rules, line by line", () => {
  assert.deepEqual(rules(`<div className="hover:bg-blue-600">`), ["tokens"]);
  assert.deepEqual(rules(`<p className="text-[#333]">`), ["tokens"]);
  assert.deepEqual(rules(`<p style={{ color: "#333" }}>`), ["tokens"]);
  assert.deepEqual(rules(`<div className="bg-gradient-to-r">`), [
    "no-gradients",
  ]);
  assert.deepEqual(rules(`<h1 className="font-bold">`), ["weights"]);
  assert.deepEqual(rules(`<div className="border-l-4">`), ["no-side-stripes"]);
  assert.deepEqual(rules(`<div className="shadow-md">`), ["flat"]);
  assert.deepEqual(rules(`<button onClick={go}>`), ["use-components"]);
  // FTDS tokens, and a token through var(), are fine
  assert.deepEqual(
    rules(
      `<div className="bg-bg-primary-600 text-txt-black-700 shadow-dialog outline-[rgb(var(--fr-primary))]">`,
    ),
    [],
  );
});

test("shadcn and Radix habits", () => {
  assert.deepEqual(rules(`<DialogTrigger asChild>`), ["render-not-aschild"]);
  assert.deepEqual(rules(`className={cn("p-4", className)}`), ["clx-not-cn"]);
  assert.deepEqual(rules(`className={clx("p-4", className)}`), []);
  assert.deepEqual(rules(`import * as Dialog from "@radix-ui/react-dialog";`), [
    "no-primitives",
  ]);
  assert.deepEqual(rules(`import { Dialog } from "@base-ui/react/dialog";`), [
    "no-primitives",
  ]);
  // A multi-line import ends on its `from` line
  assert.deepEqual(rules(`} from "@base-ui/react";`), ["no-primitives"]);
  // Base UI's utilities have no FTDS version
  assert.deepEqual(
    rules(`import { useRender } from "@base-ui/react/use-render";`),
    [],
  );
});

test("colours the project defines itself are allowed", () => {
  const colours = new Set(["primary-600"]);
  assert.deepEqual(
    checkSource(`<a className="text-primary-600">`, { colours }),
    [],
  );
  // Only the project's own names: other raw colours on the line still count
  assert.deepEqual(
    checkSource(`<a className="text-primary-600 bg-danger-600">`, {
      colours,
    }).map((p) => p.found),
    ["bg-danger-600"],
  );
});

test("the command reads the project's colours, not FTDS's theme", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ftds-check-"));
  fs.mkdirSync(path.join(root, "src/styles/ftds"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "src/styles/app.css"),
    "@theme {\n  --color-primary-600: var(--agency-primary);\n}",
  );
  fs.writeFileSync(
    path.join(root, "src/styles/ftds/theme.css"),
    "@theme { --color-danger-600: #dc2626; }",
  );
  fs.writeFileSync(
    path.join(root, "src/page.tsx"),
    `<a className="text-primary-600" />\n<p className="text-danger-600" />`,
  );
  const result = spawnSync(process.execPath, [SCRIPT, "src"], {
    cwd: root,
    encoding: "utf-8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /page\.tsx:2 {2}tokens/);
  assert.doesNotMatch(result.stdout, /page\.tsx:1 /);
  fs.rmSync(root, { recursive: true });
});

test("Astro files keep native inputs, selects and tables", () => {
  assert.deepEqual(rules(`<input type="search" name="q" />`, "astro"), []);
  assert.deepEqual(rules(`<table>`, "astro"), []);
  assert.deepEqual(rules(`<button type="button">`, "astro"), [
    "use-components",
  ]);
  assert.deepEqual(rules(`<div class="text-gray-500">`, "astro"), ["tokens"]);
});

test("comments and ftds-check-ignore are skipped", () => {
  assert.deepEqual(rules(`// A Well card: no border, no shadow`), []);
  assert.deepEqual(rules(` * Never bg-blue-600.`), []);
  assert.deepEqual(rules(`<div /* shadow */ className="p-4">`), []);
  // `//` in a URL isn't a comment
  assert.deepEqual(
    rules(`<a href="https://www.gov.my" className="font-bold">`),
    ["weights"],
  );
  assert.deepEqual(
    rules(
      `<div className="shadow-md"> {/* ftds-check-ignore: a drag ghost */}`,
    ),
    [],
  );
  assert.deepEqual(
    rules(
      `// ftds-check-ignore-next: a drag ghost\n<div className="shadow-md">`,
    ),
    [],
  );
});

test("one primary Button per return", () => {
  const two = `return (
  <>
    <Button>Save</Button>
    <Button
      variant="primary-fill"
      onClick={() => (a > b ? go() : stop())}
    >
      Send
    </Button>
    <Button variant="default-outline">Cancel</Button>
  </>
);`;
  const problems = checkSource(two).filter((p) => p.rule === "one-primary");
  assert.deepEqual(
    problems.map((p) => p.line),
    [4],
  );

  // An early return is a different state of the screen
  const states = `if (sent) return <Button>Done</Button>;
return <Button type="submit">Send</Button>;`;
  assert.deepEqual(rules(states), []);

  // A variant from an expression or a spread can't be known, so it isn't counted
  assert.deepEqual(
    rules(
      `return <><Button variant={v}>A</Button><Button {...props}>B</Button><Button>C</Button></>;`,
    ),
    [],
  );
});

test("the command skips build output and the files FTDS installed", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ftds-check-"));
  const bad = `<p className="text-gray-500" />`;
  const write = (file: string) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), bad);
  };
  const checked = ["src/components/payment.tsx", "src/pages/index.astro"];
  const skipped = [
    "src/components/ui/button.tsx",
    "src/components/ui/button.astro",
    "src/lib/ftds/utils.ts",
    "src/styles/ftds.css",
    "src/env.d.ts",
    "node_modules/x/index.js",
    "dist/index.js",
    ".claude/skills/ftds/scripts/ftds-check.mjs",
    "README.md",
  ];
  [...checked, ...skipped].forEach(write);

  const reported = (stdout: string) =>
    [...stdout.matchAll(/^(.+):\d+ {2}/gm)].map((m) =>
      path.relative(root, m[1]!),
    );
  assert.deepEqual(reported(run(root).stdout), checked);
  // Files passed one by one (a hook's staged files) go through the same filter
  const one = run(
    ...[skipped[0]!, skipped.at(-1)!, checked[0]!].map((f) =>
      path.join(root, f),
    ),
  );
  assert.deepEqual(reported(one.stdout), [checked[0]]);
  fs.rmSync(root, { recursive: true });
});

test("the command prints file:line and exits 1 on a problem", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ftds-check-"));
  fs.writeFileSync(
    path.join(root, "ok.tsx"),
    `<p className="text-txt-black-700" />`,
  );
  const clean = run(root);
  assert.equal(clean.status, 0, clean.stdout + clean.stderr);
  assert.match(clean.stdout, /1 file, no problems/);

  fs.writeFileSync(
    path.join(root, "bad.tsx"),
    `\n<p className="text-gray-500" />`,
  );
  const dirty = run(root);
  assert.equal(dirty.status, 1);
  assert.match(dirty.stdout, /bad\.tsx:2 {2}tokens {2}Raw palette colour/);
  assert.match(dirty.stdout, /1 problem in 2 files/);
  fs.rmSync(root, { recursive: true });
});
