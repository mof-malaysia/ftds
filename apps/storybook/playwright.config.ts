import { defineConfig } from "@playwright/test";

/**
 * Accessibility tests for the FTDS React components, run against the static
 * Storybook build (`pnpm build` first): the same bundle that gets published.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://127.0.0.1:6007" },
  webServer: {
    // vite preview, not python3 -m http.server as in the Astro Storybook:
    // this build loads many more chunks at once, and Python's small listen
    // backlog drops some of them
    command:
      "vite preview --outDir dist --host 127.0.0.1 --port 6007 --strictPort",
    url: "http://127.0.0.1:6007/index.json",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "ignore",
  },
});
