---
title: Working with AI agents
description: How to build with FTDS through a coding agent: install the FTDS skill, ask for outcomes, review what the agent added, and keep your project looking like FTDS as it grows.
order: 6
---

Coding agents such as Claude Code can build FTDS screens well, as long as they follow the same rules you would. The FTDS agent skill gives them those rules. This guide is for the engineer working with the agent: how to set it up, how to ask, and what to check.

## Set it up once per project

Install the skill with the shadcn CLI, after [setup](https://mof-malaysia.github.io/ftds/guides/setup.md):

```bash
npx shadcn@latest add @ftds/ftds-skill
```

It adds `.claude/skills/ftds/` beside the project's `components.json`. In a monorepo that is the app's folder, such as `apps/admin/`; Claude Code finds the skills when it works in that folder, so start it there. Commit the folder, so everyone on the team and every agent session works from the same rules. When you update your FTDS components to a new release, install the skill again so its rules match.

Claude Code loads the skill on its own whenever you ask for UI work. Other agents may not look in `.claude/skills/`; point them at `.claude/skills/ftds/SKILL.md` in your `AGENTS.md`.

## Ask for the outcome, not the parts

Describe the screen the way you would to a colleague: "a page where a taxpayer reviews their declaration before submitting it". You don't need to say "use FTDS", "use tokens" or "no borders"; the skill covers that.

Avoid naming parts ("a card with a table and a blue button"). The skill makes the agent look for a whole block first, then components, and only then build something new. Naming parts pushes it straight to the last step.

## Not sure what it should look like? Explore first

It's hard to picture a screen from nothing. The explore skill builds several working versions of it for you to flip through, choose from, or take another round on:

```bash
npx shadcn@latest add @ftds/ftds-explore-skill
```

Then, in Claude Code:

```text
/ftds-explore a page where an officer reviews a refund claim and approves or rejects it
```

The versions all look like FTDS, so they differ in structure, such as one page or several steps, not in style. The agent names each one, says when it's the right choice and what it costs, and tells you where to see them and how to switch. Then say "another round, more like Stepped", or "keep Stepped" to have it built properly in the project.

## Review the summary first

When it finishes, the agent lists two things:

- **Project components it created.**
- **FTDS blocks it edited.**

Review those first: that is where a project's look drifts from FTDS. If both lists are empty, the screen is built entirely from FTDS parts, which is what you want most of the time.

## When the agent stops and asks

The agent uses your project's own colour tokens, such as an agency's primary, where you have them. It stops instead of inventing a colour, a font weight or a shadow, or editing FTDS's own files. That is the skill doing its job, so don't tell it to go ahead anyway. Either the design changes to fit FTDS, or the need goes to the FTDS team in [Discussions](https://github.com/mof-malaysia/ftds/discussions).

## Your own components

Every project needs things FTDS doesn't have, and that's expected. The agent builds them from FTDS components and tokens, keeps them in a folder of their own, and documents each one, as the skill's [extending guide](https://github.com/mof-malaysia/ftds/blob/main/skills/ftds/references/extending.md) describes.

If a component of yours is something other services would need too, such as a common government screen or a form pattern, propose it in [Discussions](https://github.com/mof-malaysia/ftds/discussions). That's how FTDS grows.

## Check it before you merge

The skill comes with a checker for the design rules that can be read from code: raw palette colours, shadows on static elements, font weights, hand-built controls, `asChild` and `cn`, and more than one primary button. The agent runs it on its changes. Run it in your own pre-commit hook or CI too, so it covers every change, not only the agent's. It needs Node and nothing else:

```bash
node .claude/skills/ftds/scripts/ftds-check.mjs src
```

Run it from the folder with `components.json`. It prints each problem as `file:line` and exits with 1 if it finds any. It skips the files FTDS installed, and allows the colours your project defines in its own CSS (`--color-*`). To keep something it flags on purpose, add an `ftds-check-ignore` comment on that line that says why.

A checker can't see the screen, though. Before you merge, take two minutes yourself:

- Switch to dark mode, if your project has one, then narrow the window to phone width.
- Use the page with the keyboard alone.
- Look for lines and boxes: FTDS groups things with space and tone, so a screen full of outlines has drifted.

## When the skill is wrong

If the skill sends the agent the wrong way, the fix belongs in FTDS: [open an issue](https://github.com/mof-malaysia/ftds/issues). Don't work around it in your project's `CLAUDE.md`. Otherwise every project ends up with its own slightly different rules, which is the problem the skill exists to solve.
