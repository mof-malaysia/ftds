import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRules, checkScreen, compile, screenImports } from "./check";
import { decodeScreen, encodeScreen, type Screen } from "./screen";

const modules = {
  "@/components/ui/button": ["Button", "ButtonIcon", "ButtonProps"],
  "@/components/ui/icons/check": ["CheckIcon"],
};

const errors = (code: string) =>
  checkScreen(code, modules).filter((p) => p.severity === "error");

test("a valid screen passes and compiles to CommonJS", () => {
  const code = `import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
export default function Screen() {
  const [n, setN] = useState<number>(0);
  return <Button onClick={() => setN(n + 1)}>{n}</Button>;
}`;
  assert.deepEqual(checkScreen(code, modules), []);
  assert.deepEqual(screenImports(code, modules), ["@/components/ui/button"]);
  const js = compile(code);
  assert.match(js, /require\(["']@\/components\/ui\/button["']\)/);
  assert.match(js, /require\("react\/jsx-runtime"\)/);
});

test("unknown modules and names are errors with a hint", () => {
  const [unknown] = errors(
    `import { Button } from "@/components/ui/buton";\nexport default () => null;`,
  );
  assert.match(unknown!.message, /Did you mean "@\/components\/ui\/button"/);
  assert.equal(unknown!.line, 1);

  const [name] = errors(
    `import { Buton } from "@/components/ui/button";\nexport default () => null;`,
  );
  assert.match(name!.message, /doesn't export Buton. It exports: Button/);
});

test("default imports, other packages and CSS imports are errors", () => {
  assert.equal(
    errors(
      `import Button from "@/components/ui/button";\nexport default () => null;`,
    ).length,
    1,
  );
  assert.equal(
    errors(`import { Check } from "lucide-react";\nexport default () => null;`)
      .length,
    1,
  );
  assert.equal(
    errors(`import "./styles.css";\nexport default () => null;`).length,
    1,
  );
});

test("a screen needs a default export and must compile", () => {
  assert.match(
    errors(`export function Screen() { return null; }`)[0]!.message,
    /default export/,
  );
  const [syntax] = errors(
    `export default function Screen() {\n  return <div>;\n}`,
  );
  assert.match(syntax!.message, /Doesn't compile/);
  assert.equal(syntax!.line, 2);
});

// Each rule is tested in ftds-check.test.ts; this is what checkRules adds
test("design rules are warnings that say what they found, imports aside", () => {
  assert.deepEqual(checkRules(`<p className="font-bold">`), [
    {
      severity: "warning",
      rule: "weights",
      line: 1,
      message: `Font weight outside 400, 500 and 600. Use font-normal, font-medium or font-semibold. Found: font-bold`,
    },
  ]);
  // checkImports already stops a screen that imports a primitive
  assert.deepEqual(
    checkRules(`import { Dialog } from "@base-ui/react/dialog";`),
    [],
  );
});

test("a screen survives the share link round trip", () => {
  const screen: Screen = {
    v: "v0.1.0",
    title: "Permohonan geran",
    code: "export default () => <p>RM 1,250.00 — ✓</p>;",
    theme: "dark",
    viewport: "mobile",
  };
  const fragment = encodeScreen(screen);
  assert.match(fragment, /^[\w+\-$]+$/);
  assert.deepEqual(decodeScreen(`#${fragment}`), screen);
  assert.equal(decodeScreen("#not-a-screen"), undefined);
});
