import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { ftdsPaths } from "../../packages/react/paths.mjs";
import { ftdsAstroPaths } from "../../packages/astro/paths.mjs";

/**
 * Where the site is served. The Pages workflow sets FTDS_SITE_URL (by default
 * https://mof-malaysia.github.io/ftds), which gives `base: "/ftds"`; without it
 * the site builds for the root, as `astro dev` expects.
 */
const siteUrl = new URL(process.env.FTDS_SITE_URL || "http://localhost:4321");

export default defineConfig({
  site: siteUrl.origin,
  base: siteUrl.pathname,
  trailingSlash: "ignore",
  integrations: [react()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
    },
  },
  vite: {
    // Stories and examples import FTDS the way a project that ran `shadcn add`
    // does. Astro paths first: they only answer for `.astro` imports.
    plugins: [ftdsAstroPaths(), ftdsPaths(), tailwindcss()],
    resolve: {
      alias: {
        // Stories import `fn` for Storybook's Actions panel; the docs don't need it
        "storybook/test": fileURLToPath(
          new URL("./src/lib/storybook-test.ts", import.meta.url),
        ),
      },
    },
  },
});
