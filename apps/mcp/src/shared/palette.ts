/**
 * The colour names and utilities the design-rule checks look for. Kept apart
 * from check.ts, which needs sucrase, so scripts/registry/generate-agent.ts
 * can build the FTDS skill's grep check from the same lists.
 */

/** Tailwind's own colour names. FTDS screens use tokens (bg-bg-*, text-txt-*, border-otl-*) instead. */
export const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|primary|danger|success|warning";

/** Tailwind utilities that take a colour. */
export const COLOUR_UTILITY =
  "bg|text|border|border-[trblxy]|ring|outline|fill|stroke|divide|from|via|to|decoration|accent|caret|placeholder";
