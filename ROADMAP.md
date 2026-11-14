# Roadmap

> Draft by Claude from the repo, docs, issues and commits as of 2026-11-14. Owned by Irfan: edit freely. `/pm` reads this file and only proposes changes to it.

## Now (this quarter, in priority order)

### 1. Coding agents can build with the Astro components

Agents (and laman, which is built on FTDS) get the same per-component docs and install names for the Astro components and blocks that they already get for React. Ranked first because laman is the priority-1 project and agents are how FTDS is consumed; the link to laman is an inference, not something the repo says.

Done when:

- `llms.txt` and `llms-full.txt` list every `astro-*` registry item with its own page (When to use, Usage, Notes), and `pnpm llms:check` covers them.
- The playground's `list_components` and `read_docs` say which framework each item is for.
- Component pages on the docs site have React | Astro tabs where an item exists in both stacks.

Evidence: docs/rfc/astro.md, Phases ("React | Astro tabs in the docs and framework fields in `llms.txt` and the MCP server … are still to do"); `scripts/llms/build.ts` documents only React (its summary line counts "React components, blocks and helpers"); 52 `.astro` components in `packages/astro/src/components` with no `.md` docs; recent work is Astro-heavy (0473d7af, ea2d2622, 15ad82b1, 157681d2).

### 2. Astro Phase 3: content components

Agency sites can keep news, events, people and articles in Astro Content Collections and render them with FTDS.

Done when:

- Content Collection schemas (`astro/zod`) ship as registry items for the content types, fitting the existing `news-list`, `event-details` and `people-grid` blocks rather than adding parallel ones.
- An MDX component map for articles ships, built on `prose`.
- Each has a story in `apps/storybook-astro` and passes the axe sweep; the news and event templates use them.

Evidence: docs/rfc/astro.md, Phases (Phase 3 is the only phase not marked done) and Content Collections; `packages/astro/src/components/content/` does not exist yet.

### 3. Automated axe and keyboard tests for the React components

The React library, which `PRODUCT.md` calls primary, gets the same push-time accessibility checks the Astro components have.

Done when:

- An axe (WCAG 2.2 AA) check runs on every React story in the pre-push hook, through turbo, and passes.
- Keyboard tests cover the interactive components (dialog, menu, select, combobox, tabs at least).
- PRODUCT.md (Accessibility & Inclusion) and REGISTRY.md (Future Enhancements) no longer list this as missing.

Evidence: REGISTRY.md, Future Enhancements; PRODUCT.md, Accessibility & Inclusion ("the React components don't have them yet"); `apps/storybook/package.json` already has `@storybook/test-runner` and a `test-storybook` script, but `lefthook.yml` only runs the Astro tests.

### 4. Bring the Dependabot alerts down

No open high-severity alerts, and the remaining ones are understood.

Done when:

- The direct `turbo` alerts are fixed by a bump.
- The transitive high alerts (axios, brace-expansion, minimatch, nanoid, js-yaml, joi, postcss, browserslist, source-map-js) are fixed by upgrading their parents or by `pnpm.overrides`, with the pre-push hook passing.
- Any alert left open is dismissed with a reason.

Evidence: 96 open Dependabot alerts on 2026-11-14, 94 of them transitive; axios accounts for 35, brace-expansion 14, minimatch 7. Dependency bumps #21 (astro) and #24 (vite 5 → 6, merged 2026-11-14).

### 5. The playground is ready for wider use

The MCP playground is protected against abuse and always matches the published registry.

Done when:

- `/mcp` is rate limited.
- The Release workflow deploys `ftds-mcp` from the release tag (with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets), instead of a hand deploy.
- It is served from a custom domain, and the docs and README point there.

Evidence: apps/mcp/PLAN.md, Remaining work and Open decisions; DEPLOYMENT.md, Cloudflare (both Workers deployed by hand from the maintainer's account); `.github/workflows/release.yml` has no Cloudflare step.

## Next

- Astro Container API snapshot tests, and screenshot comparison against React for components in both stacks (docs/rfc/astro.md, Testing).
- Playground: multi-screen flows in one share link, short links in KV, WebMCP on the share page (apps/mcp/PLAN.md, Later).
- Trim the playground preview (3 MB, 880 KB gzipped) if it loads slowly in Claude (apps/mcp/PLAN.md, Findings).
- Support multiple style variants (REGISTRY.md, Future Enhancements).

## Not doing

- App components in the Astro distribution; the generator enforces it (docs/rfc/astro.md, Summary and Decisions).
- Parity between Astro and React. Bringing an Astro-only component back to React is decided case by case (docs/rfc/astro.md, Decisions).
- Astro wrappers for heavy widgets such as combobox; they are documented as React islands instead (docs/rfc/astro.md, Decisions: Escape hatch).
- A starter kit, or templates as registry items: templates are reference pages to copy (docs/rfc/astro.md, Decisions and Phase 4).
- npm packages: FTDS ships only as a shadcn registry (CLAUDE.md; 55224448).
- A CI workflow: the git hooks are the checks, and nothing deploys from `main` (CONTRIBUTING.md, Git hooks; DEPLOYMENT.md, Branching model).
- Accepting outside pull requests for new features as a rule; ideas go to Discussions first (CONTRIBUTING.md, New features).
- AI, keys or storage in the playground: the user's own assistant does the work and the Worker stays stateless (apps/mcp/PLAN.md).

## Known gaps

- No open issues at all, so none labelled `ready`: `/pm` has nothing to start (`gh issue list --repo mof-malaysia/ftds --state open`, 2026-11-14).
- React components have no automated axe or keyboard tests; the test-runner is installed but not wired in (`apps/storybook/package.json`, `lefthook.yml`).
- `llms.txt` and the playground catalogue cover React only (`scripts/llms/build.ts`, `apps/mcp/scripts/catalogue.cts`).
- 96 open Dependabot alerts, 2 direct (`turbo`) and 94 transitive.
- The playground is deployed by hand to `ftds-mcp.irfan-ismail96.workers.dev`, unrated and on a personal account (apps/mcp/PLAN.md, Status; DEPLOYMENT.md, Cloudflare).
- docs/rfc/astro.md is partly stale: its status line says the phases are done "on `feat/astro-foundation`", which merged in #16; Phase 1 isn't marked done in the phase list; and it says showing templates on the docs site "is still open", but `apps/docs/src/pages/templates` and `apps/docs/src/lib/templates.ts` exist.
- Release cadence is fast (8 tags from v0.1.0 on 2026-10-29 to v0.2.5 on 2026-11-14) while 0.x allows breaking changes, so consumers depend on pinning a tag (DEPLOYMENT.md).

## Questions for Irfan

1. Dependabot's vite 5 → 6 major (#24) was merged today, 2026-11-14, by the time this draft was written. Should major bumps wait for you as a rule (one per PR, with a note on what was checked), or is the pre-push hook passing enough? And should `/pm` raise the next major (Storybook, Astro, vite 7) as a decision rather than as review work?
2. What does laman need from FTDS first: agent docs for the Astro items (goal 1), content components (goal 2), or something not listed here, such as more blocks? The order of goals 1 and 2 is a guess.
3. There are no open issues. Should `/pm` draft `ready` issues from the Now goals for you to approve, or will you file them?
4. The playground goal depends on decisions apps/mcp/PLAN.md leaves open (which Cloudflare account, which domain, who holds the deploy token). Is it a Now goal, or Next until those are settled?
