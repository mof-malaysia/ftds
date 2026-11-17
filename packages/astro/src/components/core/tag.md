---
title: Tag (Astro)
description: A small wash label for the status or category of an item, such as Paid, Open or Closed. The words carry the meaning, never colour alone.
category: Data display
---

## When to use

- Use `Tag` to show the status or category of an item: beside a title, on a card, in a news listing.
- Use `Callout` for a message about the page, and `PhaseBanner` to say a service is in Alpha or Beta.

## Usage

```astro
---
import Tag from "@/components/ui/tag.astro";
---

<div class="flex flex-wrap gap-2">
  <Tag variant="success">Dibuka</Tag>
  <Tag variant="warning" dot>Tutup dalam 3 hari</Tag>
  <Tag variant="danger">Ditutup</Tag>
  <Tag>Pengumuman</Tag>
</div>
```

## Notes

- `variant` is `default` (grey), `primary`, `success`, `danger` or `warning`; `size` is `small`, `medium` (default) or `large`.
- The text must say the status on its own; colour only reinforces it.
- `dot` adds a dot in the tag's colour before the label, hidden from screen readers.
- Tags are borderless washes. Don't add outlines or solid fills, and don't make a tag clickable; use a `Button` or `Link` for actions.
