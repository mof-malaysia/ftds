---
name: ftds
description: Build and extend UI with FTDS, the Ministry of Finance Malaysia's design system, in React or Astro. Use whenever you add or change a screen, page, form, layout or component in a project whose components.json has the @ftds namespace or that installs from mof-malaysia/ftds, including when the project needs something FTDS doesn't have.
---

# FTDS

FTDS is a design system for Malaysian government services, installed with the shadcn CLI. The project owns the copied source, but it must still look and behave like FTDS: calm, plain, flat and accessible. Build with what FTDS already has, and extend it so that a reader can't tell the extension apart from FTDS itself.

## Before you write UI

1. **Find out the stack.** `.astro` pages and `astro-*` items mean Astro; `.tsx` and items without the prefix mean React. Don't mix them on one page, except a React island for a heavy widget in Astro (see the component's page).
2. **Read the index.** [llms.txt](https://mof-malaysia.github.io/ftds/llms.txt) lists every guide and component with a one-line summary. Use only the parts and props a component's page lists; don't guess names from shadcn or Radix.
3. **Check what is installed.** Look in `components/ui`, `components/blocks` and `lib/ftds` before installing. If a file there has a comment saying it was changed from FTDS, keep the change. Install missing items at the version `components.json` already pins.

If the user isn't sure what the screen should look like, suggest `/ftds-explore` (the `ftds-explore` skill, when installed) to build versions to choose from before you build one.

## Choose the smallest step that works

Go down this list and stop at the first step that does the job:

1. **A block** (`components/blocks/*`): a whole screen or section, such as sign-in, check your answers, confirmation, hero or FAQ. Pass content and handlers through its props.
2. **A component as it is**, with its `variant`, `size` and other documented props.
3. **Components composed together**, using `render` to change the element, and `className` for layout only (margins, width, grid placement).
4. **An edited block.** Edit the installed block file. Don't edit `components/ui/*` to get a different look.
5. **A project component** built from FTDS tokens and parts, when nothing above fits. Follow [references/extending.md](references/extending.md).

If you reach step 5 for something many services would need (a common government screen, a form pattern, an official element, not this project's business logic), say so in your summary: it may belong in FTDS, through [FTDS Discussions](https://github.com/mof-malaysia/ftds/discussions).

## Rules

These are the rules from llms.txt. They apply to every file you touch, including project components.

{{rules}}

## Don't change the system

Don't change the installed theme files (`styles/ftds.css`, `styles/ftds/*`) or `*.variants.ts` files, and don't add colour, type, radius, shadow or spacing values of your own. They are FTDS's, not the project's. If the task seems to need it, stop and tell the user why instead.

## Before you finish

Run the project's own lint, typecheck and tests. Then search the files you changed for the patterns FTDS forbids, and fix every hit that isn't a false positive:

```bash
# Raw palette colours
grep -nE '{{palette}}' <files>
# Arbitrary colours, gradients, shadows on static elements, weights outside 400–600, side stripes
grep -nE -- '-\[(#|rgb|hsl|oklch|color)|bg-(gradient|linear|radial|conic)-|(^|[ "`])shadow(-(sm|md|lg|xl|2xl))?([ "`]|$)|font-(thin|extralight|light|bold|extrabold|black)\b|border-[ls]-([2-9]|\[)' <files>
# shadcn and Radix habits
grep -nE '\basChild\b|\bcn\(|@base-ui/react|@radix-ui' <files>
# Hand-built controls where an FTDS component exists
grep -nE '<(button|input|select|textarea|table)[ >/]' <files>
```

Then check the result the way FTDS does, in the browser if you can:

- Light and dark mode, and phone width.
- Keyboard: every control is reachable with Tab, in order, with a visible focus ring.
- Squint at it. If you still see a grid of grey rectangles, there are too many lines and boxes.

In your summary, list any project component you added and any FTDS block you edited, so a reviewer can look at them first.
