import { expect, test } from "@playwright/test";
import { openStory } from "./story";

const story = "core-tabs--default";

test("tabs: arrow keys, Home and End move and activate", async ({ page }) => {
  await openStory(page, story);
  const tab = (name: string) => page.getByRole("tab", { name });
  // Named, since Base UI keeps the previous panel mounted for a frame while
  // it unmounts
  const panel = (name: string) => page.getByRole("tabpanel", { name });
  const expectActive = async (name: string) => {
    await expect(tab(name)).toBeFocused();
    await expect(tab(name)).toHaveAttribute("aria-selected", "true");
  };
  await tab("Details").focus();
  await page.keyboard.press("ArrowRight");
  await expectActive("Documents");
  await expect(panel("Documents")).toHaveText(/3 documents uploaded/);
  await page.keyboard.press("End");
  await expectActive("History");
  await expect(panel("History")).toHaveText(/Assigned to an officer/);
  await page.keyboard.press("Home");
  await expectActive("Details");
  // The arrows wrap at either end
  await page.keyboard.press("ArrowLeft");
  await expectActive("History");
  await page.keyboard.press("ArrowRight");
  await expect(tab("Details")).toBeFocused();
});

test("tabs: only the active panel shows", async ({ page }) => {
  await openStory(page, story);
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.getByRole("tabpanel")).toHaveText(/APP-2025-00418/);
  await page.getByRole("tab", { name: "Payments" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.getByRole("tabpanel")).toHaveText(/Submitted 12 March/);
});
