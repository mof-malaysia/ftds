---
name: FTDS Docs
description: FTDS, with an expressive frame of its own, for the documentation site at apps/docs-astro.
colors:
  plate: "#1D4ED8"
  plate-raised: "#1E40AF"
  rail: "#172554"
  rail-raised: "#1E3A8A"
  dark-plate: "#1E3A8A"
  dark-rail: "#0F1838"
  on-frame: "#FFFFFF"
  on-frame-secondary: "#DBEAFE"
  on-frame-tertiary: "#96B7FF"
  code-ground: "#18181B"
  dark-code-ground: "#0E0E11"
rounded:
  control: "8px"
  sheet: "12px"
---

# Design System: FTDS Docs

The root [DESIGN.md](../../DESIGN.md) is the authority for anything this file doesn't say. This site adds no palette, typeface or radius of its own. Its expression comes from FTDS primitives promoted to named roles.

## The one exception

The root system keeps FTDS Blue to 10% of a screen, because a service is quiet by construction. This site is not a service. The frame (rail, plate, home bands) is blue on purpose and on the owner's decision of 9 November 2026. The reading column, the stages inside examples, and every component shown stay strictly by the root rules.

## North star: The Specimen Plate

Every page opens with the real thing, measured. The plate is a full-bleed Primary 700 band; on it, a white sheet holds a live component. `src/scripts/measure.ts` reads the rendered size from the DOM and draws dimension lines. Flip density or stack and the lines move, because the numbers are the component's own.

## Roles

- **Rail** (Primary 950): the sticky left navigation, and the React panel and agents band on the home page. Stays deep in dark mode.
- **Plate** (Primary 700, Primary 900 in dark): the opener of every page, and the first and last bands of the home page.
- **Sheet** (`bg-white` token): the only thing that sits on the plate. Follows the theme.
- **Code** (Ink, in both themes): every code block, with GitHub Dark Dimmed. On Ink, not in a Well.

Text on the frame is white, Primary 100, or Primary 300 for quiet labels at 13px and up. Secondary text on the frame is never grey.

## The mark

"Nest": one corner drawn at two sizes, 44 and 32, the two FTDS densities, forming an F. White strokes on FTDS Blue, with a 32 grid, stroke 4 and 8px corners. On a plate-blue field the square drops away. Files: `public/logo.svg`, `public/logo-mono.svg`, `public/favicon.svg`. It sits beside FiscalCR's mark as family: same square, same round white stroke.

## Conditions

Stack, density and theme are the conditions bar: plain toggle groups at the top of the plate. They live on `<html>`, persist in `localStorage`, and apply to every example on the page. A condition with no effect on a page is left out; a stack a component doesn't have is disabled, not hidden.

Stacks hide with CSS (`data-for`, `data-only`), so both are in the HTML and work without a re-render.

## Examples

Every example is a Storybook story. React stories run as islands (`StoryStage.tsx`), server-rendered first. Astro stories render natively (`AstroStory.astro`). Stories that only re-show dark mode or compact density are dropped, because the conditions bar does that. Don't write examples here: add a story.

## Type

Inter throughout, as the root says. The plate title is the one display size beyond the root scale: 48 to 88px, weight 600, tracking -0.035em. A system monospace is for code only.

## Motion

Dimension lines slide over 220ms when a condition changes. Cross-page view transitions keep the rail still. Everything else is the root's state-change motion.

## Component references

A component named in running text is a chip (`.ref`): Blue Wash, FTDS Blue text, Inter 500, linked to its page. `<code>` is for props, values, tokens and paths only. `src/lib/refs.ts` turns `<code>ComponentName</code>` from Markdown into chips; in hand-written pages use `<Ref name="Button" />`.

## Sections

Each `h2` opens a section with a Hairline and 40px above it. This site's reading pages use dividers on purpose, on the owner's request; the root rule of separating with space applies to the services you build.

## Don't

- Don't put a plate colour inside the reading column or a stage.
- Don't draw dimensions by hand. If it can't be measured, fit it to the sheet and say the scale.
- Don't add a kicker above a title, and don't put a shadow on anything that doesn't float.
