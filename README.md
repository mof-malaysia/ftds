<p align="center">
  <img src="apps/docs/public/logo.svg" alt="FTDS logo" width="88" height="88">
</p>

<h1 align="center">FTDS</h1>

<p align="center">
  <strong>Build public services that people trust.</strong><br>
  Accessible components and ready-made screens for forms, payments, case work and public websites, in React and Astro. Free to use, and yours to keep.
</p>

<p align="center">
  <a href="https://mof-malaysia.github.io/ftds">Documentation</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="https://mof-malaysia.github.io/ftds/components">Components</a> ·
  <a href="https://mof-malaysia.github.io/ftds/storybook">Storybook</a> ·
  <a href="#ai-assistants-and-coding-agents">AI assistants</a>
</p>

---

> **Coding agents:** before building UI with FTDS, read [llms.txt](https://mof-malaysia.github.io/ftds/llms.txt). It has the rules and a page for every guide and component.

FTDS, the FiscalTech Design System, gives a team the parts of a public service that shouldn't be designed from scratch each time. FiscalTech builds it, maintains it and uses it on its own projects, and your team is welcome to use it too.

|                               |                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| **A faster first release**    | Sign-in, forms, payments and case review are ready to adapt, so effort goes into the service itself. |
| **Accessible from the start** | Every component is built to WCAG 2.2 AA, including keyboard and screen reader support.               |
| **Two languages**             | Layouts hold both Bahasa Melayu and English without cutting off key information.                     |
| **For the public and staff**  | Comfortable for people applying once a year, compact for officers working in it all day.             |
| **Code you own**              | Components are copied into your repository, ready to review, change and hand over to the next team.  |
| **Adopt at your own pace**    | Add one component at a time and pin a release, so updates arrive when you choose.                    |
| **No licence cost**           | MIT licensed, with no fees for any number of users or services.                                      |

## Quick start

FTDS is a [shadcn](https://ui.shadcn.com) registry: the CLI copies the source into your project, so there is no package to install. You need Tailwind CSS v4 and either stack below.

Add the registry to `components.json`:

```json
{
  "registries": {
    "@ftds": "https://mof-malaysia.github.io/ftds/r/v0/{name}.json"
  }
}
```

`v0` follows the newest 0.x release, and 0.x releases can include breaking changes. For anything that ships, pin an exact [release](https://github.com/mof-malaysia/ftds/releases), such as `v0.2.2`.

### React

For services: anything people sign in to, fill in or work in. Needs React 18 or 19 and shadcn's default Base UI setup.

```bash
npx shadcn@latest init
npx shadcn@latest add @ftds/ftds-init
npx shadcn@latest add @ftds/button --overwrite
```

Then import the styles in your global CSS, in this order:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/ftds.css";
```

Read the full [React setup guide](https://mof-malaysia.github.io/ftds/start/setup).

### Astro

For websites: agency pages, landing pages and campaigns. Components send no JavaScript by default. Needs Astro 7 or later.

```bash
npx shadcn@latest add @ftds/ftds-init
npx shadcn@latest add @ftds/astro-hero @ftds/astro-masthead
```

```astro
---
import Hero from "@/components/blocks/hero.astro";
---

<Hero
  title="Bayar bil kerajaan di satu tempat"
  primaryAction={{ label: "Mula membayar", href: "/bayar" }}
/>
```

Read the full [Astro setup guide](https://mof-malaysia.github.io/ftds/start/astro), or [compare the two stacks](https://mof-malaysia.github.io/ftds/start/stacks).

## What's included

| Item   | Install name                 | What it is                                                               |
| ------ | ---------------------------- | ------------------------------------------------------------------------ |
| React  | `button`, `sign-in-form`     | Over 100 components and blocks, from form fields to officer workstations |
| Astro  | `astro-button`, `astro-hero` | Around 50 components and blocks, plus whole page templates to copy       |
| Icons  | `icon-chevron-down`          | 220 icons, for React and Astro, installed one at a time                  |
| Styles | `ftds-init`                  | Tailwind v4 tokens, light and dark themes, and both densities            |

Browse them in the [component catalogue](https://mof-malaysia.github.io/ftds/components), or see [REGISTRY.md](./REGISTRY.md) for how the registry works.

## AI assistants and coding agents

- **Try a screen in the chat.** The [FTDS MCP server](https://mof-malaysia.github.io/ftds/mcp) lets Claude or ChatGPT mock up screens with real components, ready to share with your team.
- **Give your agent the docs.** [`llms.txt`](https://mof-malaysia.github.io/ftds/llms.txt) is the index and rules, and [`llms-full.txt`](https://mof-malaysia.github.io/ftds/llms-full.txt) is everything in one file. Add it to your project's `AGENTS.md` or `CLAUDE.md`.
- **Install by search.** With the `@ftds` namespace set, the [shadcn MCP server](https://ui.shadcn.com/docs/mcp) can find and install items for an agent:

```bash
npx shadcn@latest mcp init --client claude   # or cursor, vscode, codex, opencode
```

## Develop

Requires Node.js 18 or later and pnpm 9.

```bash
pnpm install                                    # also installs the git hooks
pnpm --filter @mof-malaysia/ftds-docs dev       # docs site
pnpm --filter @mof-malaysia/ftds-storybook dev  # Storybook at http://localhost:6006
```

| Path                   | What it holds                                                            |
| ---------------------- | ------------------------------------------------------------------------ |
| `apps/docs`            | The documentation site, built with Astro from the Storybook stories      |
| `apps/storybook`       | React component browser, with the Astro components composed in           |
| `apps/storybook-astro` | Astro component browser, with accessibility and keyboard tests           |
| `apps/mcp`             | The MCP server for Claude and ChatGPT                                    |
| `packages/react`       | React source, by tier: `core`, `app` and `marketing`                     |
| `packages/astro`       | Astro source, icons, labels and page templates                           |
| `packages/style`       | Tailwind v4 tokens and themes, plus classes shared by React and Astro    |
| `docs/guides`          | The guides, published on the site and to coding agents                   |
| `registry/`            | Generated registry files, committed so the CLI can read them from GitHub |

| Command                  | What it does                                                |
| ------------------------ | ----------------------------------------------------------- |
| `pnpm lint`              | oxlint across the workspace, failing on any warning         |
| `pnpm typecheck`         | Type checks every package                                   |
| `pnpm format`            | oxfmt over `.ts`, `.tsx` and `.md` files                    |
| `pnpm icons:generate`    | Rebuild the React and Astro icons from the SVG sources      |
| `pnpm registry:build`    | Regenerate `registry.json` and everything under `registry/` |
| `pnpm registry:validate` | Check the registry with `shadcn registry validate`          |
| `pnpm llms:check`        | Type check every example in the component docs and guides   |

Commits format staged files, then run lint and type checks. Pushes also check the registry and agent docs, build the sites and run the tests, so commit the output of `pnpm registry:build` with any component, doc, icon or style change.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow, [DEPLOYMENT.md](./DEPLOYMENT.md) for releases, and [DESIGN.md](./DESIGN.md) and [PRODUCT.md](./PRODUCT.md) for the thinking behind the system.

## FTDS and MYDS

FTDS is a fork of MYDS, the Malaysia Government Design System, carried forward by the team that built it and developed independently of the original project. It keeps the MYDS colours, and adds service screens, a compact density for officers, native Astro components and source-based installation.

## Licence

MIT. See [LICENSE](./LICENSE).
