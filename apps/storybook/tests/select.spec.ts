import { expect, test } from "@playwright/test";
import { openStory } from "./story";

const story = "core-select--default";

for (const key of ["Enter", "Space", "ArrowDown"]) {
  test(`select: ${key} on the trigger opens it`, async ({ page }) => {
    await openStory(page, story);
    await page.getByRole("combobox", { name: "State" }).focus();
    await page.keyboard.press(key);
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("option", { name: "Johor" })).toBeFocused();
  });
}

test("select: arrows move and Enter selects", async ({ page }) => {
  await openStory(page, story);
  const trigger = page.getByRole("combobox", { name: "State" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("option", { name: "Johor" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Kelantan" })).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("option", { name: "Kedah" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveText("Kedah");
});

test("select: Escape closes without changing the value", async ({ page }) => {
  await openStory(page, story);
  const trigger = page.getByRole("combobox", { name: "State" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Kedah" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveText("Choose a state");
});
