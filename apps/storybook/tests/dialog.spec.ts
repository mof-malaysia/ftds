import { expect, test } from "@playwright/test";
import { expectEscapeRestoresFocus, expectFocusCycle } from "./keyboard";
import { openStory } from "./story";

const story = "core-dialog--default-light";

for (const key of ["Enter", "Space"]) {
  test(`dialog: ${key} on the trigger opens it and focus moves inside`, async ({
    page,
  }) => {
    await openStory(page, story);
    await page.getByRole("button", { name: "Padam data" }).focus();
    await page.keyboard.press(key);
    const dialog = page.getByRole("dialog", { name: "Adakah anda pasti?" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Lapor kejadian" }),
    ).toBeFocused();
  });
}

test("dialog: Tab and Shift+Tab stay inside", async ({ page }) => {
  await openStory(page, story);
  await page.getByRole("button", { name: "Padam data" }).click();
  await expectFocusCycle(page, page.getByRole("dialog"), [
    "Lapor kejadian",
    "Batal",
    "Ya, teruskan",
    "Close",
  ]);
});

test("dialog: Escape closes and focus returns to the trigger", async ({
  page,
}) => {
  await openStory(page, story);
  await expectEscapeRestoresFocus(
    page,
    page.getByRole("button", { name: "Padam data" }),
    page.getByRole("dialog"),
  );
});
