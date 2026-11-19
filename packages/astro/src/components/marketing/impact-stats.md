---
title: Impact Stats (Astro)
description: What a programme has achieved, with the evidence: each figure on its own Sheet card with what it counts, the period it covers and its source, linked where published.
---

## When to use

- Use `ImpactStats` for results people may want to check, when figures come from different sources or need their period: households helped, money paid out, applications processed.
- Use `StatsBand` for two to four headline figures that share one source line.

## Usage

```astro
---
import ImpactStats from "@/components/blocks/impact-stats.astro";
import Link from "@/components/ui/link.astro";
---

<ImpactStats
  title="Kesan Belanjawan 2026"
  stats={[
    {
      value: "5.4 juta",
      label: "isi rumah menerima Sumbangan Tunai Rahmah",
      period: "Januari hingga September 2026",
      source: { label: "Kementerian Kewangan", href: "https://www.mof.gov.my" },
    },
    {
      value: "RM 10.2 bilion",
      label: "dibayar terus ke akaun bank penerima",
      period: "2026",
      source: { label: "Laporan Ekonomi 2026" },
    },
  ]}
>
  <Link href="/data-terbuka" primary>Data penuh di portal data terbuka</Link>
</ImpactStats>
```

## Notes

- The figures are a description list: screen readers hear the label first, then the value. Write `label` to read after the value ("5.4 juta" "isi rumah dibantu").
- A figure people can't check is a claim. Give every figure a `source`, and an `href` when the data is published.
- The default slot sits under the cards, for a methodology note or a link to the open data.
- Templates in `packages/astro/src/templates` that use it: `agency-home.astro`.
