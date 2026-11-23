import { expect, test } from "@playwright/test";
import { expectEscapeRestoresFocus } from "./keyboard";
import { openStory } from "./story";

const story = "core-menu--default";

for (const key of ["Enter", "Space", "ArrowDown"]) {
  test(`menu: ${key} on the trigger opens it on the first item`, async ({
    page,
  }) => {
    await openStory(page, story);
    await page.getByRole("button", { name: "Actions" }).focus();
    await page.keyboard.press(key);
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /^Edit/ })).toBeFocused();
  });
}

test("menu: arrows, Home, End and typeahead move between items", async ({
  page,
}) => {
  await openStory(page, story);
  await page.getByRole("button", { name: "Actions" }).focus();
  await page.keyboard.press("Enter");
  const item = (name: string | RegExp) => page.getByRole("menuitem", { name });
  await expect(item(/^Edit/)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(item("Duplicate")).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(item(/^Edit/)).toBeFocused();
  await page.keyboard.press("End");
  await expect(item("Delete")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(item(/^Edit/)).toBeFocused();
  await page.keyboard.press("m");
  await expect(item("Move to")).toBeFocused();
});

test("menu: Enter activates the focused item", async ({ page }) => {
  await openStory(page, "core-menu--checkbox-and-radio-items");
  await page.getByRole("button").focus();
  await page.keyboard.press("Enter");
  const dueDate = page.getByRole("menuitemcheckbox", { name: "Due date" });
  await expect(dueDate).toHaveAttribute("aria-checked", "false");
  await page.keyboard.press("ArrowDown");
  await expect(dueDate).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dueDate).toHaveAttribute("aria-checked", "true");
});

test("menu: Escape closes and focus returns to the trigger", async ({
  page,
}) => {
  await openStory(page, story);
  await expectEscapeRestoresFocus(
    page,
    page.getByRole("button", { name: "Actions" }),
    page.getByRole("menu"),
  );
});
