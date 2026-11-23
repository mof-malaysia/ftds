---
title: Working with AI agents
description: Build with FTDS through a coding agent, and keep your project looking like FTDS.
order: 6
---

The FTDS skill teaches coding agents, such as Claude Code, to build with FTDS.

## Set up

```bash
npx shadcn@latest add @ftds/ftds-skill
```

- Commit the `.claude/skills/ftds/` folder it adds, so the whole team uses it.
- Install it again when you update FTDS.
- In a monorepo, it goes in the app's folder, beside `components.json`. Start Claude Code there.
- Using another agent? Point your `AGENTS.md` at `.claude/skills/ftds/SKILL.md`.

## Ask for the outcome

Say what the screen is for, not what's on it. The agent then looks for an FTDS block before building anything.

- **Do:** "A page where a taxpayer reviews their declaration before submitting."
- **Don't:** "A card with a table and a blue button."

## Explore first

Not sure what it should look like? Add the explore skill:

```bash
npx shadcn@latest add @ftds/ftds-explore-skill
```

Then ask for versions:

```text
/ftds-explore a page where an officer reviews a refund claim
```

You get a few named, working versions to switch between. Then reply "keep Stepped", or "another round, more like Stepped".

## Review its summary

Look at these first:

- **New project components**
- **Edited FTDS blocks**

That's where designs drift. If both are empty, the screen is all FTDS.

## When FTDS doesn't have it

- The agent uses your project's colours, but won't invent a colour, font weight or shadow, or edit FTDS's files. If it stops to ask, change the design rather than overriding it.
- Missing components are built from FTDS parts, in their own folder, with a short doc.

If other services would need it too, propose it in [Discussions](https://github.com/mof-malaysia/ftds/discussions).

## Before you merge

Run the design checker, and add it to your pre-commit hook or CI:

```bash
node .claude/skills/ftds/scripts/ftds-check.mjs src
```

Run it beside `components.json`. It lists problems as `file:line` and allows your project's own colours. To keep a line it flags, add `ftds-check-ignore` with a reason.

Then check what it can't see:

- Check dark mode, if you have it, and phone width.
- Use the page with the keyboard alone.
- Look for outlines and boxes. FTDS separates things with space and tone.

## If the skill gets it wrong

[Open an issue](https://github.com/mof-malaysia/ftds/issues) on FTDS. Don't patch around it in your own `CLAUDE.md`.
