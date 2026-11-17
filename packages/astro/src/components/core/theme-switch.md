---
title: Theme Switch (Astro)
description: An icon button (sun or moon) that switches between the light and dark themes and saves the choice. Put it in the top bar, with ThemeScript in the head.
category: Actions
---

## When to use

- Use `ThemeSwitch` to let people choose between the light and dark themes. Put it in a top bar or the `Navbar`'s `actions` slot.
- Add `ThemeScript` to `<head>` as well, with the same `storageKey`, so the saved theme applies before the page paints.

## Usage

```astro
---
import ThemeSwitch from "@/components/ui/theme-switch.astro";
import ThemeScript from "@/components/ui/theme-script.astro";
---

<html lang="ms">
  <head>
    <ThemeScript />
  </head>
  <body>
    <header class="flex items-center justify-end p-4">
      <ThemeSwitch />
    </header>
  </body>
</html>
```

## Notes

- It sets `dark` or `light` on `<html>`, saves the choice in localStorage under `storageKey` (default `ftds-theme`) and follows the system setting until a choice is saved. Switching dispatches `ftds:theme-change` on `document` with `detail.theme`.
- It needs JavaScript, so it is hidden until the script runs.
- Its accessible name is `label` and the current theme: "Tema: Cerah" in BM (the default) or "Theme: Light" in English. Change the words with `label`, `lightLabel` and `darkLabel`. The name and icon follow the `<html>` class in CSS.
- It is the icon toggle only; there is no select form and no `ThemeProvider` as in React.
- Don't write `dark:` overrides for FTDS tokens; they already switch with the theme.
