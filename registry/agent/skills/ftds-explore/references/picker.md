# The prototype picker

A floating bar that switches between variants, one at a time and at full size. It is the same in every project, so copy the file for your stack into the prototype folder unchanged; don't redesign it. The files end in `.txt` so the project's own tooling ignores them here; drop that when you copy. Switching is instant, with no transition, and a shared link opens the variant it names. The bar floats over the page, so it has the floating-layer shadow FTDS allows (`shadow-context-menu`); that is not a rule break.

## React

Copy [picker.tsx.txt](picker.tsx.txt) to the prototype folder as `picker.tsx` (for example `src/prototypes/picker.tsx`). Give each round one page, at the prototype route, that passes its variants:

```text
import { PrototypePicker } from "./picker";

function Stepped() {
  return <main>{/* the Stepped variant */}</main>;
}

function AtAGlance() {
  return <main>{/* the At a glance variant */}</main>;
}

export default function ApplyPrototype() {
  return (
    <PrototypePicker
      variants={[
        { id: "stepped", name: "Stepped", render: () => <Stepped /> },
        { id: "at-a-glance", name: "At a glance", render: () => <AtAGlance /> },
      ]}
    />
  );
}
```

The chosen variant is kept in the URL (`?variant=stepped`). In Next.js, the page needs `"use client"` at the top.

## Astro

Copy [picker.astro.txt](picker.astro.txt) to the prototype folder as `picker.astro` (for example `src/prototypes/picker.astro`). Each variant gets its own page through one dynamic route, `src/pages/prototypes/<slug>/[variant].astro`, which works on static and server-rendered sites alike:

```text
---
import Picker from "@/prototypes/picker.astro";
import Stepped from "@/prototypes/apply/stepped.astro";
import AtAGlance from "@/prototypes/apply/at-a-glance.astro";

const variants = [
  { id: "stepped", name: "Stepped", Component: Stepped },
  { id: "at-a-glance", name: "At a glance", Component: AtAGlance },
];

export function getStaticPaths() {
  return ["stepped", "at-a-glance"].map((variant) => ({ params: { variant } }));
}

const { variant } = Astro.params;
const current = variants.find((v) => v.id === variant) ?? variants[0]!;
---

<current.Component />
<Picker variants={variants} current={current.id} base="/prototypes/apply" />
```
