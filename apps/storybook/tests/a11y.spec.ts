import { expect, test } from "@playwright/test";
import { getViolations, injectAxe } from "axe-playwright";
import { listStories, openStory } from "./story";

// Every story passes axe (WCAG 2.2 AA). The whole body is checked, not just
// #storybook-root, so content portaled out of it (dialogs, menus, popovers)
// is covered too; Storybook's own hidden chrome is skipped by axe.
for (const story of listStories()) {
  test(`a11y: ${story.title} / ${story.name}`, async ({ page }) => {
    // Storybook's a11y addon would run axe in the same frame on render;
    // switch it to manual so only this check runs
    await openStory(page, story.id, "&globals=a11y.manual:!true");
    await injectAxe(page);
    const violations = await getViolations(page, "body", {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });
    expect(
      violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`),
    ).toEqual([]);
  });
}
