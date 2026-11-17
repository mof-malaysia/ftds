---
title: Behaviour scripts (Astro)
description: The small client-side helpers behind the interactive Astro components: set-up that survives view transitions, safe localStorage and keyboard focus movement.
category: Utilities
---

## When to use

- The scripted Astro components (Callout, CookieBanner, Tabs, ThemeSwitch, and the Navbar and Carousel blocks) install `astro-scripts` and import from it in their own `<script>`. You rarely import it yourself.
- Import it when you write a small script of your own that should follow the same rules: markup works without JavaScript, scripts find elements by `data-*` attributes, and set-up runs again after every Astro view transition.

## Usage

```astro
---
---

<section data-copy-link>
  <p>Kongsi halaman ini:</p>
  <button type="button" hidden data-ftds-requires-js>Salin pautan</button>
</section>

<script>
  import { onEach } from "@/lib/ftds/scripts";

  onEach("[data-copy-link]", (root) => {
    root.querySelector("button")?.addEventListener("click", () => {
      void navigator.clipboard.writeText(location.href);
    });
  });
</script>
```

## Notes

- `onEach(selector, setup)` runs `setup` once for every matching element, now and after each view transition (`astro:page-load`), never twice for one element. Afterwards it shows the elements inside marked `hidden data-ftds-requires-js`: controls that only work with JavaScript. `setup` may return a cleanup function, run before the next view transition swaps the page.
- `readStorage` and `writeStorage` wrap localStorage, returning `null` or doing nothing where it is unavailable (private modes, sandboxes).
- `moveFocus` moves focus among items with the arrow keys, Home and End, as a tablist or toolbar does. `trackExpanded` keeps a popover trigger's `aria-expanded` in step with the popover. `isEditable` says whether a key press is text entry, so page-wide shortcuts leave it alone.
- Astro bundles a component's `<script>` once per page, however many times the component appears.
