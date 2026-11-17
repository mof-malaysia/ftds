---
title: Skiplink (Astro)
description: A "Skip to main content" link that stays hidden until it gets keyboard focus. Put it first on every page so keyboard users can jump past the masthead and navigation.
category: Official site elements
---

## When to use

- Add one `Skiplink` to every page, as the first focusable element, before the `Masthead`.
- Point it at the page's `<main>` element.

## Usage

```astro
---
import Skiplink from "@/components/ui/skiplink.astro";
---

<body>
  <div class="relative">
    <Skiplink />
    <main id="main" tabindex="-1">
      <h1>Bantuan Sara Hidup</h1>
    </main>
  </div>
</body>
```

## Notes

- `href` defaults to `#main` (React requires it); it must match the target's `id`. Give the target `tabindex="-1"` so focus moves to it in every browser.
- The text is "Langkau ke kandungan utama" in BM (the default) or "Skip to main content" in English; the default slot overrides it.
- It is visually hidden until focused, then shows near the top left as a `primary-outline` button. It is absolutely positioned, so give the page wrapper `relative`.
