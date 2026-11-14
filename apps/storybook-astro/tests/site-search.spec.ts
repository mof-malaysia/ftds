import { expect, test } from "@playwright/test";
import { openStory } from "./story";

/** The query string the form submits next, with the submit itself stopped. */
const nextSubmit = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const form =
          document.querySelector<HTMLFormElement>("form[role=search]")!;
        form.addEventListener(
          "submit",
          (event) => {
            event.preventDefault();
            const data = [...new FormData(form)].map(([k, v]) => [
              k,
              String(v),
            ]);
            resolve(new URLSearchParams(data).toString());
          },
          { once: true },
        );
      }),
  );

test("site search: Enter and the button submit the query with its params", async ({
  page,
}) => {
  await openStory(page, "marketing-site-search--in-one-collection");
  const field = page.getByRole("searchbox", { name: "Cari dalam berita" });
  await expect(field).toHaveValue("belanjawan");
  // A real submit button: Button used to write type="button" before the passed type
  const button = page.getByRole("button", { name: "Cari" });
  await expect(button).toHaveAttribute("type", "submit");

  let query = nextSubmit(page);
  await field.press("Enter");
  expect(await query).toBe("q=belanjawan&koleksi=Berita");

  query = nextSubmit(page);
  await button.click();
  expect(await query).toBe("q=belanjawan&koleksi=Berita");
});

test("site search: / focuses the field, Escape leaves it when empty", async ({
  page,
}) => {
  await openStory(page, "marketing-site-search--large");
  const field = page.getByRole("searchbox", { name: "Cari dalam laman ini" });
  await page.locator("body").press("/");
  await expect(field).toBeFocused();
  await expect(field).toHaveValue("");
  await field.press("Escape");
  await expect(field).not.toBeFocused();
});
