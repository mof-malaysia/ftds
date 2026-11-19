---
title: Logo Cloud (Astro)
description: The agencies or partners that use a service, as a quiet row of logos, greyed at rest and in full colour on hover or focus.
---

## When to use

- Use `LogoCloud` under a `Hero` to show which agencies use a service, as quiet reassurance.
- Use `PartnerGrid` when people need to know who does what, with names, descriptions and links.

## Usage

```astro
---
import LogoCloud from "@/components/blocks/logo-cloud.astro";
---

<LogoCloud
  title="Agensi yang menggunakan MyBayar"
  logos={[
    { src: "/logos/lhdn.svg", alt: "Lembaga Hasil Dalam Negeri", href: "https://www.hasil.gov.my", width: 120, height: 40 },
    { src: "/logos/jpj.svg", alt: "Jabatan Pengangkutan Jalan", width: 120, height: 40 },
  ]}
/>
```

## Notes

- Every logo needs `alt` naming the organisation; it is the link's name when the logo has an `href`.
- Logos are greyed and slightly faded at rest and return to full colour on hover or focus, so they support the page without competing with it. Set `muted={false}` for full colour.
- Give `width` and `height` so the row doesn't shift as logos load; they are lazy-loaded.
- The title is a small centred line, not a section heading.
- No template uses it yet; see Marketing › Logo Cloud in the Astro Storybook.
