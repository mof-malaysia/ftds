import { expect, test } from "@playwright/test";
import { openStory } from "./story";

const story = "app-combobox--default";

test("combobox: typing filters, arrows move and Enter selects", async ({
  page,
}) => {
  await openStory(page, story);
  const input = page.getByRole("combobox", { name: "State of residence" });
  await input.focus();
  await page.keyboard.type("pe");
  await expect(page.getByRole("option")).toHaveText(["Perak", "Perlis"]);
  const highlighted = page.locator("[role=option][data-highlighted]");
  await page.keyboard.press("ArrowDown");
  await expect(highlighted).toHaveText("Perak");
  await expect(input).toHaveAttribute(
    "aria-activedescendant",
    (await highlighted.getAttribute("id"))!,
  );
  await page.keyboard.press("ArrowDown");
  await expect(highlighted).toHaveText("Perlis");
  await page.keyboard.press("ArrowUp");
  await expect(highlighted).toHaveText("Perak");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(input).toHaveValue("Perak");
  await expect(input).toBeFocused();
});

test("combobox: Escape closes the list, then a second Escape clears", async ({
  page,
}) => {
  await openStory(page, story);
  const input = page.getByRole("combobox", { name: "State of residence" });
  await input.focus();
  await page.keyboard.type("sel");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Selangor");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(input).toHaveValue("Selangor");
  await page.keyboard.press("Escape");
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
});
