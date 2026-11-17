import type { Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/** Every story in the built Storybook (dist/index.json), except those tagged `skip`. */
export function listStories(): { id: string; title: string; name: string }[] {
  const index = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../dist/index.json"), "utf-8"),
  );
  return Object.values(index.entries as Record<string, any>).filter(
    (entry) => entry.type === "story" && !entry.tags?.includes("skip"),
  );
}

/**
 * Open a story on its own, failing if Storybook shows its error box, and wait
 * for its transitions to end (the dark background fades in, dialogs animate
 * open), so axe doesn't read the colours mid-way.
 */
export async function openStory(page: Page, id: string, query = "") {
  await page.goto(`/iframe.html?id=${id}&viewMode=story${query}`);
  // Storybook's render phase ends after the story's effects ran, including
  // the backgrounds addon setting a dark story's background
  await page.waitForFunction(
    () =>
      document.body.classList.contains("sb-show-errordisplay") ||
      (window as any).__STORYBOOK_PREVIEW__?.currentRender?.phase ===
        "finished",
  );
  if (await page.locator("body.sb-show-errordisplay").count()) {
    throw new Error(
      `${id} failed to render: ${await page.locator("#error-message").innerText()}`,
    );
  }
  await page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    await Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    );
  });
}
