import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Tab from the first of `names` (already focused) through the rest and wrap
 * back to it, then Shift+Tab all the way round the other way: focus never
 * leaves `scope`.
 */
export async function expectFocusCycle(
  page: Page,
  scope: Locator,
  names: string[],
) {
  const button = (name: string) => scope.getByRole("button", { name });
  await expect(button(names[0])).toBeFocused();
  for (const name of [...names.slice(1), names[0]]) {
    await page.keyboard.press("Tab");
    await expect(button(name)).toBeFocused();
  }
  for (const name of [...names].reverse()) {
    await page.keyboard.press("Shift+Tab");
    await expect(button(name)).toBeFocused();
  }
}

/** Open `popup` with Enter on `trigger`, close it with Escape, and check focus goes back. */
export async function expectEscapeRestoresFocus(
  page: Page,
  trigger: Locator,
  popup: Locator,
) {
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).toBeHidden();
  await expect(trigger).toBeFocused();
}
