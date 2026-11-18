---
title: CTA Cards (Astro)
description: A call to action with a choice, as two or three Sheet cards: ways to do the same thing (online, at a counter, by post) or next steps for different people.
---

## When to use

- Use `CtaCards` when people have to pick how to act: apply online, at a counter or by post; or the next step for citizens, businesses and agencies.
- Use `CtaBand` when there is one action, and `ServiceHighlights` to list services people came for.

## Usage

```astro
---
import CtaCards from "@/components/blocks/cta-cards.astro";
import DesktopIcon from "@/components/ui/icons/desktop.astro";
import GovtOfficeIcon from "@/components/ui/icons/govt-office.astro";
---

<CtaCards
  title="Pilih cara memohon"
  description="Permohonan dalam talian diproses paling cepat."
  options={[
    {
      icon: DesktopIcon,
      title: "Dalam talian",
      description: "Kira-kira 15 minit, dengan MyDigital ID.",
      action: { label: "Mohon dalam talian", href: "/mohon" },
      recommended: true,
    },
    {
      icon: GovtOfficeIcon,
      title: "Di kaunter",
      description: "Bawa MyKad dan slip gaji terkini anda.",
      action: { label: "Cari pejabat", href: "/pejabat" },
    },
  ]}
/>
```

## Notes

- Mark the option most people should take `recommended`: it gets the only filled button, the others an outline one, so the page keeps one primary action. Mark one at most.
- Two or three options; extra items are dropped.
- `icon` is an icon component, not an element, passed unsized; it renders decorative in a primary-wash badge.
- The cards are Sheet on either `tone`. Each card's title is an `h3` under the section title (an `h2` when there is none).
- Templates in `packages/astro/src/templates` that use it: `agency-home.astro`.
