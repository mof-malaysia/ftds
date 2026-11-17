---
title: Card (Astro)
description: Groups related content on its own surface, white on the page or Well for secondary content, with no border or shadow. Title, description, action and footer slots.
category: Layout
---

## When to use

- Use `Card` to set apart one self-contained piece of a page: a service summary, a deadline with its action, one item in a grid.
- Use `InsetText` for a passage set apart from the text around it, and `Callout` for a status message.
- Don't use a card for one paragraph or one button; put that straight on the page.

## Usage

```astro
---
import Card from "@/components/ui/card.astro";
import Button from "@/components/ui/button.astro";
---

<Card title="Cukai perlu dibayar" titleAs="h2" description="Tahun taksiran 2025">
  <Button slot="action" variant="default-ghost" href="/returns/2025">Lihat penyata</Button>
  <p>Bayar sebelum 30 April 2026 untuk mengelakkan penalti.</p>
  <Button slot="footer" href="/pay">Bayar sekarang</Button>
</Card>
```

## Notes

- React's `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent` and `CardFooter` parts are props and slots here: `title` and `description` (or the `title` and `description` slots), the `action` slot top-right for one quiet action, the default slot for the content, and the `footer` slot for the main actions. Fill the `header` slot to replace the whole header.
- The title renders an `h3` by default; set `titleAs` (`h2`, `h3`, `h4` or `div`) to fit the page's heading order.
- `tone` is `sheet` (default, white on a Paper page) or `well` (inside a white panel). Cards have no border and no shadow; if one seems to need an edge, the tones are too close.
- Never put a card inside a card. The footer is separated by spacing, not a divider.
