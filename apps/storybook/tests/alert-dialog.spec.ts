import { expect, test } from "@playwright/test";
import { expectEscapeRestoresFocus, expectFocusCycle } from "./keyboard";
import { openStory } from "./story";

// The danger variant is where landing on the safe action matters most
const story = "core-alertdialog--danger-light";

for (const key of ["Enter", "Space"]) {
  test(`alert dialog: ${key} opens it with focus on the least destructive action`, async ({
    page,
  }) => {
    await openStory(page, story);
    await page.getByRole("button", { name: "Lihat Dialog" }).focus();
    await page.keyboard.press(key);
    const dialog = page.getByRole("dialog", { name: "Bahaya" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Batal" })).toBeFocused();
  });
}

test("alert dialog: Tab and Shift+Tab stay inside", async ({ page }) => {
  await openStory(page, story);
  await page.getByRole("button", { name: "Lihat Dialog" }).click();
  await expectFocusCycle(page, page.getByRole("dialog"), [
    "Batal",
    "Ya, teruskan",
    "Close",
  ]);
});

test("alert dialog: Escape closes and focus returns to the trigger", async ({
  page,
}) => {
  await openStory(page, story);
  await expectEscapeRestoresFocus(
    page,
    page.getByRole("button", { name: "Lihat Dialog" }),
    page.getByRole("dialog"),
  );
});
