---
title: Separator (Astro)
description: A single hairline between two groups of content, horizontal or vertical. Lines must earn their place; reach for spacing and tone first.
category: Layout
---

## When to use

- Use `Separator` for the few places a line helps: between items of metadata on one line, between groups in a toolbar.
- Don't use it between cards, between page sections or between every list item. Separate those with spacing or a tonal surface (`bg-bg-washed`) instead.

## Usage

```astro
---
import Separator from "@/components/ui/separator.astro";
---

<div class="flex h-5 items-center gap-3">
  <span>Draf</span>
  <Separator orientation="vertical" decorative />
  <span>Dikemas kini 3 Mei 2026</span>
</div>
```

## Notes

- It renders a `<div role="separator">`, announced by screen readers. Pass `decorative` when the line only repeats a split that is already obvious, so they skip it.
- `orientation` is `horizontal` (default, full width) or `vertical` (stretches to the row's height).
- It is always the Hairline colour, 1px. Don't thicken or recolour it.
