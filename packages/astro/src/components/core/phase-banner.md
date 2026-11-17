---
title: Phase Banner (Astro)
description: A slim bar under the masthead that says a service is in Alpha or Beta (or under maintenance) and asks for feedback.
category: Official site elements
---

## When to use

- Use `PhaseBanner` while a site or service is new (Alpha or Beta) or temporarily limited (Maintenance). Place it directly under the `Masthead`.
- Remove it once the service is live and stable.
- Use `AnnounceBar` for a marketing announcement, and `Callout` for a message about one page.

## Usage

```astro
---
import PhaseBanner from "@/components/ui/phase-banner.astro";
import Link from "@/components/ui/link.astro";
---

<PhaseBanner phase="Beta">
  Ini perkhidmatan baharu. <Link href="/maklum-balas" primary class="font-medium">Maklum balas</Link>
  anda membantu kami menambah baiknya.
</PhaseBanner>
```

## Notes

- `phase` is the tag text ("Beta" by default; the `phase` slot overrides it), and `tagVariant` its colour: `primary` (default) for Alpha and Beta, `warning` for Maintenance.
- The default slot is the message, wrapped in a `<p>`, so pass inline content only. Without it, the dictionary's message shows in the page's language.
- For the feedback link use `<Link primary class="font-medium">`, as React's `PhaseBannerLink` does.
- `class` styles the full-width bar and `containerClass` the inner row, centred at 1280px. It scrolls away with the page; don't make it sticky.
