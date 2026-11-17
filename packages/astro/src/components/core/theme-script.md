---
title: Theme Script (Astro)
description: A tiny inline script for the head that applies the saved or system theme before the page paints, so dark-theme visitors never see a flash of the light one.
category: Utilities
---

## When to use

- Add `ThemeScript` to `<head>` on every page that has a `ThemeSwitch`, so the saved theme applies before the first paint.
- Without a `ThemeSwitch`, add it on its own to follow the visitor's system setting.

## Usage

```astro
---
import ThemeScript from "@/components/ui/theme-script.astro";
import ThemeSwitch from "@/components/ui/theme-switch.astro";
---

<html lang="ms">
  <head>
    <meta charset="utf-8" />
    <ThemeScript />
  </head>
  <body>
    <ThemeSwitch />
  </body>
</html>
```

## Notes

- It sets `dark` or `light` on `<html>`: the theme saved in localStorage under `storageKey` (default `ftds-theme`), else the system's `prefers-color-scheme`. FTDS tokens switch on `.dark`.
- Use the same `storageKey` as the `ThemeSwitch`.
- It is an inline, blocking script, so it runs before the page renders, and it sets the class again on each Astro view transition.
- It renders nothing visible and takes no other props. In React, the setup guide's `<head>` script does the same job.
