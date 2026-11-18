---
title: Figure (Astro)
description: A picture on its own in a page (a photo, chart or diagram) with an optional caption and credit under it, at reading width, page width or edge to edge.
---

## When to use

- Use `Figure` for a picture that stands between sections of a page: a photo of a new office, a chart in a report summary.
- Put pictures that belong to the running text inside `Prose`, and an article's lead photo in the `PageIntro` `media` slot.

## Usage

Put the `<img>` (or `<picture>`) in the default slot, with its own `alt`, `width` and `height`:

```astro
---
import Figure from "@/components/blocks/figure.astro";
---

<Figure caption="Pejabat baharu di Presint 2, dibuka Januari 2027." credit="Unit Komunikasi Korporat">
  <img src="/images/pejabat.jpg" width="1600" height="900" alt="Bangunan pejabat lima tingkat berdinding kaca" />
</Figure>
```

## Notes

- The picture fills the figure's width. `width` is `article` (default, the reading width of the text around it), `wide` (the page's width) or `full` (edge to edge; the caption stays in the page's column).
- Say in the caption what the picture shows that the text doesn't. The alt text and the caption shouldn't repeat each other; an image the caption fully describes can take `alt=""`.
- `credit` shows after "Kredit:" / "Credit:". The `caption` and `credit` slots take links.
- No template uses it yet; see Marketing › Figure in the Astro Storybook.
