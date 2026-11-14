# FTDS

A design system for Malaysian government services. It ships as a shadcn registry, not as npm packages: `registry/` and `registry.json` are generated and committed. pnpm 9 + Turborepo.

## Layout

- `packages/react/src/components/{core,app,marketing}`: React components (Base UI). Each has a `<name>.md` doc beside it. Icons: `src/svg/icons/*.svg` are the source, and `src/icons/` is generated.
- `packages/astro/src/components/{core,marketing}`: Astro components (no app tier; see `docs/rfc/astro.md`). Templates are in `src/templates`.
- `packages/style`: tokens and shared cva variants (`variants/<name>`) used by both stacks.
- `apps/docs` (Astro docs site), `apps/storybook` (React), `apps/storybook-astro` (Astro, with Playwright axe and keyboard tests in `tests/`), `apps/mcp` (Cloudflare Worker).
- `scripts/`: registry, llms, icons and deploy generators.

Read before design or component work: `DESIGN.md` (visual rules), `PRODUCT.md`, `docs/guides/conventions.md`, `docs/guides/styling.md`.

## Commands

```sh
pnpm lint            # oxlint, fails on any warning (lint:fix to autofix)
pnpm typecheck       # every package via turbo, plus the root tsconfig
pnpm format          # oxfmt
pnpm llms:check      # every component has a doc, and every doc example typechecks
pnpm registry:build  # regenerate registry/ — commit the result
pnpm registry:validate
pnpm --filter @mof-malaysia/ftds-storybook-astro test   # Astro a11y and keyboard tests (needs a build first)
```

Dev servers are in `.claude/launch.json`: `astro-preview` (4330), `storybook-astro` (6008), `storybook` (6006), `docs` (4321), `mcp` (8787).

## Checks (no CI: the git hooks are the CI)

- pre-commit: format the staged files, then lint and typecheck.
- pre-push: the registry is up to date and validates, `llms:check`, then turbo build and test for both Storybooks, the docs and mcp.
- Never skip them with `LEFTHOOK=0` unless asked. If a push check fails, fix the cause.

## Rules

- **Generated files, don't hand-edit them:** `registry/`, `registry.json`, and `packages/react/src/icons/*`. Regenerate them instead (`registry:build`, `icons:generate`).
- After adding, moving or renaming a React component: `pnpm components:sync-exports`, write its `<name>.md` (frontmatter `title`, `description`, `category`; sections **When to use**, **Usage**, **Notes**; no props table; follow `button.md`), then `pnpm registry:build`.
- New or changed Astro components need a story in `apps/storybook-astro/stories/`. Add a Playwright spec when there is interaction (keyboard, disclosure, search).
- Astro: native platform features first (`<details>`, `<dialog>`, the Popover API). Use small vanilla scripts only where the platform has no answer. Built-in text comes from the BM/EN dictionary in `src/i18n`, and BM is the default.
- React: compose with `render`, never `asChild`. Use `clx`, not `cn`. Controlled/uncontrolled props use Base UI names.
- Styling: tokens only, no raw Tailwind palette colours. No added borders, shadows or bordered boxes; use spacing and `bg-bg-washed`. Never remove focus rings.
- If a turbo package reads files outside its folder, list them as `inputs` in its `turbo.json`, or the cache replays stale results.

## Verifying UI changes

Start `storybook-astro` or `astro-preview` (or `storybook` for React) with the preview tools. Check the component in light and dark mode and at phone width, and test it with the keyboard. Look at it before calling a visual change done.

## Git

Conventional commits, scoped by stack when it applies: `feat(astro): …`, `fix(react): …`, `fix(docs): …`. Work on feature branches; `main` takes squash-merged PRs.

## Autonomy

The maintainer hands off whole tasks and reviews PRs in batches. Carry a task through to an open PR without stopping for routine confirmations.

**Go ahead without asking:** edit files, run any check or test, commit on a feature branch, push a feature branch (the pre-push hook must pass), open a PR, and fix whatever a hook or test reports.

**Pick a sensible default and record it in the PR description:** naming, small refactors done along the way, docs wording, story arguments, and test structure.

**Stop and ask first:**

- Public component API: adding, renaming or removing a prop, part or registry item. These are breaking changes for anyone who installed it.
- Anything in `DESIGN.md` or `PRODUCT.md`, and any new design token.
- Adding or upgrading a dependency, except a patch or minor bump that the hooks pass.
- Releases, tags, deploys, pushing to `main`, force-pushing, and deleting branches or files outside the task.
- Skipping the hooks (`LEFTHOOK=0`) for any reason.

When a task is finished, end with: the PR link, what you decided on your own (so it can be reviewed), what you didn't verify, and the obvious next task if there is one.
