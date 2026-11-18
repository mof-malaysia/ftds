---
title: CTA Band (Astro)
description: The closing call to action of a page, on a Well or primary-wash band: a title, short text, one primary action and an optional secondary one.
---

## When to use

- Use `CtaBand` as the last section of a landing or campaign page, to repeat the one action the page is about.
- Use `CtaSplit` for a call to action with a picture mid-page, and `CtaCards` when people choose between two or three ways to act.

## Usage

```astro
---
import CtaBand from "@/components/blocks/cta-band.astro";
---

<CtaBand
  tone="primary"
  title="Daftar sebelum 31 Disember"
  description="Percuma, dan mengambil masa lima minit."
  primaryAction={{ label: "Daftar sekarang", href: "/daftar" }}
  secondaryAction={{ label: "Hubungi kami", href: "/hubungi" }}
/>
```

## Notes

- Actions take `{ label, href }` and render as `Button` links: the primary one filled, the secondary one tonal for the band. For anything else, fill the `actions` slot; `primaryAction` is required unless you do.
- `tone` is `well` (default) or `primary`, the primary wash. Never a saturated blue block, so the primary button stays the only filled blue on screen.
- Use it once per page. Keep the title to the action and the description to one line on what it takes.
- Templates in `packages/astro/src/templates` that use it: `about.astro`, `campaign.astro` and `service-landing.astro`.
