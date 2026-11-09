import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

export const locales = ["en", "ms"] as const;
export type Locale = (typeof locales)[number];

/** Written by `pnpm catalogue` from the docs next to each React component. */
const catalogue = defineCollection({
  loader: glob({ pattern: "*.md", base: "./public/components" }),
});

/** The guides, in the same form agents read them. */
const guides = defineCollection({
  loader: glob({ pattern: "*.md", base: "./public/guides" }),
});

export const collections = { catalogue, guides };
