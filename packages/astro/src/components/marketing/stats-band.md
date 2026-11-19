---
title: Stats Band (Astro)
description: Two to four headline figures on a Well band, set large in tabular figures with a label, an optional footnote and one source line.
---

## When to use

- Use `StatsBand` on a landing or campaign page for a few headline figures that make the case: how many people, how long it takes, what it costs.
- Use `ImpactStats` when figures come from different sources or need their period and context.

## Usage

```astro
---
import StatsBand from "@/components/blocks/stats-band.astro";
---

<StatsBand
  title="Mengapa ia penting"
  stats={[
    { value: "1.2 juta", label: "perniagaan kecil terlibat" },
    { value: "5 minit", label: "untuk mendaftar" },
    { value: "RM 0", label: "kos pendaftaran", footnote: "Untuk jualan kurang RM 500,000 setahun" },
  ]}
  source="Sumber: Lembaga Hasil Dalam Negeri, Oktober 2026"
/>
```

## Notes

- Two to four figures; extra items are dropped. The figures are a description list, so screen readers hear the label first.
- Keep values short ("RM 4.2 bil", "1.8 juta") and say in `source` (or the `source` slot) where and when they come from.
- The band is always Well; it has no `tone`.
- Templates in `packages/astro/src/templates` that use it: `campaign.astro`.
