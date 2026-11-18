---
title: Feature Grid (Astro)
description: What a service offers, as a section title and intro over a grid of features, each with an icon in a primary-wash circle, a title, text and an optional link.
---

## When to use

- Use `FeatureGrid` to describe what a service or agency offers: what people get, how it works, what the agency does.
- Use `ServiceHighlights` when every card is a way into a service, and `StatsBand` or `ImpactStats` for figures.

## Usage

```astro
---
import FeatureGrid from "@/components/blocks/feature-grid.astro";
import MoneyIcon from "@/components/ui/icons/money.astro";
import ClockIcon from "@/components/ui/icons/clock.astro";
import CheckShieldIcon from "@/components/ui/icons/check-shield.astro";
---

<FeatureGrid
  tone="well"
  title="Apa yang anda terima"
  features={[
    { icon: MoneyIcon, title: "Sehingga RM 2,000 setahun", description: "Bergantung pada pendapatan dan tanggungan isi rumah anda." },
    { icon: ClockIcon, title: "Dibayar dalam empat fasa", description: "Terus ke akaun bank anda.", href: "/jadual-bayaran" },
    { icon: CheckShieldIcon, title: "Tiada orang tengah", description: "Permohonan adalah percuma." },
  ]}
/>
```

## Notes

- `icon` is an icon component, not an element, passed unsized; it renders decorative.
- A feature with `href` gets a link under its text, labelled with its `linkLabel`, else the grid's `linkLabel`, else "Ketahui lanjut" / "Learn more". Give links that differ a label that says where they go.
- The grid is one column on phones. `surface="sheet"` puts each feature on a Sheet card.
- Each feature title is an `h3` under the section title (an `h2` without one). The default slot sits under the grid, for a "See all" link.
- Templates in `packages/astro/src/templates` that use it: `about.astro` and `service-landing.astro`.
