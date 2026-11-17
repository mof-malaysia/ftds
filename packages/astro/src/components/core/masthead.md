---
title: Masthead (Astro)
description: The "Official website of the Government of Malaysia" bar at the very top of every government site, with a panel that explains how to tell the site is genuine.
category: Official site elements
---

## When to use

- Put a `Masthead` at the top of every public Malaysian government site, directly after the `Skiplink` and before the `PhaseBanner` and the site's `Navbar`.
- It is not the site's header: the agency logo and navigation go in the `Navbar` below it.

## Usage

```astro
---
import Skiplink from "@/components/ui/skiplink.astro";
import Masthead from "@/components/ui/masthead.astro";
---

<div class="relative">
  <Skiplink />
  <Masthead />
  <main id="main" tabindex="-1">...</main>
</div>
```

## Notes

- `<Masthead />` alone renders the full standard masthead, texts and panel included, in the page's language: BM by default, English with `lang="en"` or an English `Astro.currentLocale`. React's `Masthead` needs its header and sections passed in; this one doesn't.
- It is a native `<details>`: the header row is the `<summary>`, so it opens and closes with JavaScript off. `open` starts it open.
- Override the texts with `title` and `trigger` (or the `title` and `trigger` slots), and replace the two explanatory sections with the `content` slot. On small screens the trigger text is visually hidden and only the chevron shows.
- It is hidden when printing and excluded from search snippets. Keep it the full width of the page; don't make it sticky.
