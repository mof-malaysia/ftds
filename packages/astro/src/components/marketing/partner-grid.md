---
title: Partner Grid (Astro)
description: The agencies, departments or partners behind a service, as Sheet cards with a logo, the organisation's name, what it does here and a link to its site.
---

## When to use

- Use `PartnerGrid` where people need to know who does what: the agencies under a ministry, the partners running a programme.
- Use `LogoCloud` for a quiet row of logos, and `PeopleGrid` for people.

## Usage

```astro
---
import PartnerGrid from "@/components/blocks/partner-grid.astro";
---

<PartnerGrid
  title="Agensi di bawah kementerian"
  columns={4}
  partners={[
    { name: "Lembaga Hasil Dalam Negeri", kind: "LHDN", description: "Cukai pendapatan", logo: "/logos/lhdn.svg", href: "https://www.hasil.gov.my", external: true },
    { name: "Jabatan Kastam Diraja Malaysia", kind: "JKDM", description: "Cukai jualan dan perkhidmatan", href: "https://www.customs.gov.my", external: true },
  ]}
/>
```

## Notes

- A card with an `href` is one link (the name, stretched over the card). An `external` link opens in a new tab and says so in its name: "(dibuka dalam tab baharu)" / "(opens in a new tab)".
- The logo is decorative, since the name sits beside it. `kind` is a short line above the name, such as the acronym.
- Each name is an `h3` under the section title (an `h2` without one).
- Templates in `packages/astro/src/templates` that use it: `about.astro` and `agency-home.astro`.
