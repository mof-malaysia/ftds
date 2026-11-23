---
name: ftds-explore
description: Explore design ideas for an FTDS screen before building it. Builds three genuinely different working versions of a screen or section from FTDS blocks and components, behind a picker, so the user can flip through them, choose one or ask for another round. Use when the user runs /ftds-explore, or asks to see options, ideas or directions for a screen.
disable-model-invocation: true
---

# Explore FTDS designs

It is hard to judge a screen from a description, and harder to describe one from nothing. This skill turns a brief into three working versions of the same screen, built from FTDS, so the user can compare them at full size, pick one, and only then build it properly.

It builds on the `ftds` skill: read `.claude/skills/ftds/SKILL.md` first. Every variant follows those rules in full.

## How FTDS variants differ

FTDS fixes colour, type, radius, shadow and motion, so variants never differ in those. Two versions that differ only in those are the same design.

Variants differ in **structure**, and each must take a different position on one of these axes:

| Axis           | Positions, for example                                                                 |
| -------------- | -------------------------------------------------------------------------------------- |
| Flow           | Everything on one page · one question per page · a task list the user returns to       |
| Emphasis       | Status first · the next action first · the details first                               |
| Layout         | One column · main content with a summary beside it · a table                           |
| Interaction    | Edit in place · edit in a dialog · edit on its own page                                |
| Disclosure     | Everything visible · details behind disclosures · a summary that links to each section |
| Finding things | Search first · filters first · a browsable list                                        |

Density (comfortable or compact) is set by who the screen is for, citizens or officers, not by taste. Vary it only when the brief doesn't say who will use the screen.

## Workflow

### 1. Scope

One screen, or one section of a screen, per run. If the brief spans several ("the whole application journey"), pick the one that decides the most, say which and why, and offer the rest as later rounds. Restate the brief in one sentence: who uses it, what they come to do, and what they must leave with.

### 2. Recon

- The stack (React or Astro) and router, and whether a dev server runs.
- The FTDS blocks and components that fit: read [llms.txt](https://mof-malaysia.github.io/ftds/llms.txt) and the pages of the candidates. A block that already does the job is a strong starting point for one variant.
- Who uses the screen (citizen or officer), and the real content: field names, statuses, amounts, Malaysian names and IC numbers, BM or English as the service uses.

### 3. Choose three directions

Before writing code, list them: a name that describes the direction ("Stepped", "At a glance", "Workbench"), never "Option A", and the axis position it takes. If two would land on the same position of every axis, they are one direction; replace one. Up to five when the user asks; never more.

### 4. Build the harness

Keep exploration out of production code:

- **In a project with a dev server:** a prototype route, such as `/prototypes/<slug>`, with one file per variant and a harness file, under a folder of its own (for example `src/prototypes/<slug>/`). Nothing outside it imports from it. Build the picker from [references/picker.md](references/picker.md).
- **No project yet:** if the FTDS playground MCP server is connected (its tools are `get_started` and `render_screen`), render each variant there instead and share the links.

Show one variant at a time, at full size, inside the page it will live in: the masthead, the page header, the neighbours. Never shrink variants side by side to compare them.

Every variant must work: real content, buttons that respond, forms that validate and show their errors. No lorem ipsum, no "imagine this part".

### 5. Check, then hand over

Flip through every variant yourself: each renders, each responds, the console is clean. Run the `ftds` skill's checks on the prototype files. If you can, take a screenshot of each.

Then present them and **stop, because the choice is the user's**:

| Variant     | Axis                      | Right when                              | Its cost                            |
| ----------- | ------------------------- | --------------------------------------- | ----------------------------------- |
| Stepped     | Flow: one question a page | Citizens filling it in once, on a phone | More pages, slower for repeat users |
| At a glance | Disclosure: all visible   | Officers checking many of these a day   | Long page for a first-time citizen  |

Say where the picker runs (the URL) and how to switch. Don't pick a favourite in the table. If asked which you would choose, answer from who uses the screen and how often, not from taste.

### 6. Next round, or keep one

- **Another round** ("more like Stepped", "Stepped, but with the summary beside it"): keep the harness, and build a new set that varies around that direction.
- **Keep one:** rebuild the chosen variant where it belongs in the project, following the `ftds` skill. Then delete the prototype folder and route, unless the user wants to keep them.

## Credit

The approach (named directions on a stated axis, one variant at a time behind a picker, promoting the winner) follows Emil Kowalski's `prototype` skill, adapted to a design system whose look is fixed.
