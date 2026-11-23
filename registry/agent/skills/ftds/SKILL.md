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

FTDS components are not an npm package: the shadcn CLI copies their source into the project, which then owns it. Before writing UI for an FTDS project, read the [conventions guide](https://mof-malaysia.github.io/ftds/guides/conventions.md) and the page of every component you use. The rules that matter most:

- **Install with the shadcn CLI, then import from the project.** `npx shadcn@latest add @ftds/<item>` (after adding the `@ftds` namespace to `components.json`, see the setup guide) or `npx shadcn@latest add mof-malaysia/ftds/<item>#<tag>`. Import components from `@/components/ui/<name>`, blocks from `@/components/blocks/<name>`, icons from `@/components/ui/icons/<name>`, and helpers from `@/lib/ftds/utils` and `@/lib/ftds/hooks`. There is no `@mof-malaysia/ftds-react` package to import.
- **Use FTDS components before writing your own.** Check the FTDS component list first: FTDS covers government chrome, forms, tables, overlays, service screens and officer workstations. Only build a custom component when nothing in FTDS fits, and then build it from FTDS tokens and parts.
- **Built on Base UI, not Radix.** Compose with the `render` prop (`<Button render={<a href="/apply" />}>Apply</Button>`), never `asChild`. State props follow Base UI: `value`/`defaultValue` with `onValueChange`, `open`/`defaultOpen` with `onOpenChange`.
- **Merge classes with `clx` from `@/lib/ftds/utils`**, not shadcn's `cn`. Pass `className` to adjust layout; don't restyle a component's colours.
- **Style with FTDS tokens, not raw Tailwind colours.** Backgrounds `bg-bg-*`, text `text-txt-*`, borders `border-otl-*`, focus `focus-ring`; for example `bg-bg-primary-600`, `text-txt-black-900`, `bg-bg-washed`. Never `bg-blue-600` or `text-gray-500`: tokens switch with dark mode and raw colours don't.
- **Wrap every form control in `Field`** with a `FieldLabel`, and put the message in `FieldError`. Never place a bare `Input`, `Select` or `Checkbox` without a visible label. After a failed submit, show an `ErrorSummary` at the top of the form.
- **Follow the design rules.** One primary (blue) action per screen; secondary actions use `variant="default-outline"`, which is a tonal fill, not an outline. Don't add borders, shadows or outlines to group content: use spacing and the `bg-bg-washed` tone. Status is a wash `Tag` plus text, never colour alone. Amounts use tabular figures (`tabular-nums`) and right-align in tables.
- **Two densities.** Citizen services use the default comfortable density. Officer tools set `data-density="compact"` on a container (`DeskShell` does it for you). Never resize controls by hand; their `size` prop is relative to the density.
- **Dark mode is the `dark` class** on `<html>` (or on any container, to make a dark island). `ThemeProvider` from `@/lib/ftds/hooks` restores the saved theme and, with a `ThemeSwitch`, toggles it and saves the choice in `localStorage` (see the setup guide to avoid a flash on load). Don't write `dark:` colour overrides for FTDS tokens; they already switch.
- **Accessible by default; keep it that way.** Every icon-only button needs an `aria-label`. Each page has one `h1` (`PageHeaderTitle` or the block's title). Don't remove focus rings. React components write their built-in text in English; translate it with the component's `labels` prop where it has one.
- **Plain language.** Error messages say what to do ("Enter your IC number in the format 900101-14-5678"), destructive confirmations name the consequence, and the primary button repeats the verb ("Delete records").
- **Say less.** Let clear labels do the work: a heading, a field label, a button verb. Add a description or hint only where people would otherwise get it wrong, in one short sentence. No paragraph under every heading, no callout repeating what the screen already shows, no hint restating its label.
- **Astro differs in three places.** Astro items are named `astro-<name>` and import from `@/components/ui/<name>.astro`, and there are no officer-workstation components. Use the platform first (`<details>`, `<dialog>`, the Popover API) and write a small script only where it has no answer. Built-in text comes from the BM and EN dictionary in `@/lib/ftds/i18n`, BM by default: each component takes its language from its `lang` prop, then the page's locale.

## Don't change the system

Don't change the installed theme files (`styles/ftds.css`, `styles/ftds/*`) or `*.variants.ts` files, and don't add colour, type, radius, shadow or spacing values of your own. They are FTDS's, not the project's. If the task seems to need it, stop and tell the user why instead.

## Before you finish

Run the project's own lint, typecheck and tests (in a monorepo, build the workspace packages first if the typecheck can't find them, as the project's docs say). Then run the FTDS checker on the files you changed, from the folder with `components.json`:

```bash
node .claude/skills/ftds/scripts/ftds-check.mjs <files or folders>
```

It reports each break of the rules above that shows in code, as `file:line rule message`. Fix every problem. If one is deliberate, keep it with an `ftds-check-ignore` comment on that line or the line above that says why, and mention it in your summary. It doesn't check files FTDS installed (`components/ui`, `lib/ftds`, `styles/ftds`).

Then check the result the way FTDS does, in the browser if you can:

- Light and dark mode (if the project has dark mode), and phone width.
- Keyboard: every control is reachable with Tab, in order, with a visible focus ring.
- Read every description, hint and callout, and delete each one the screen works without.
- Squint at it. If you still see a grid of grey rectangles, there are too many lines and boxes.

In your summary, list any project component you added and any FTDS block you edited, so a reviewer can look at them first.
