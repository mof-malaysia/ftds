---
title: Service Highlights (Astro)
description: A grid of Sheet cards that send people to the services they came for, each one link with an icon, the service name, one sentence and a row of facts.
---

## When to use

- Use `ServiceHighlights` on an agency home page for the most-used services: pay a bill, renew a licence, check an application.
- Use `FeatureGrid` to describe what one service offers, and `LinkList` for a plain list of related pages.

## Usage

```astro
---
import ServiceHighlights from "@/components/blocks/service-highlights.astro";
import Link from "@/components/ui/link.astro";
import MoneyIcon from "@/components/ui/icons/money.astro";
import DocumentIcon from "@/components/ui/icons/document.astro";
---

<ServiceHighlights
  title="Perkhidmatan popular"
  services={[
    { icon: MoneyIcon, title: "Bayar bil kerajaan", description: "Yuran, saman dan cukai taksiran.", href: "/bayar", facts: ["Dalam talian", "3 minit", "Percuma"] },
    { icon: DocumentIcon, title: "Semak status permohonan", description: "Dengan nombor rujukan anda.", href: "/semak", facts: ["Dalam talian"], tag: "Baharu" },
  ]}
>
  <Link href="/perkhidmatan" primary>Semua perkhidmatan</Link>
</ServiceHighlights>
```

## Notes

- The whole card is the link: the title's `<a>` stretches over it, so each card is one tab stop with one accessible name. Don't put other links or buttons inside a card.
- `facts` are short (online, how long it takes, the fee), shown as a dotted row. `tag` adds a status `Tag` beside the title, such as "Baharu".
- `icon` is an icon component, not an element, passed unsized; it renders decorative.
- The cards are Sheet on either `tone`. The default slot sits under the grid.
- Templates in `packages/astro/src/templates` that use it: `agency-home.astro`.
