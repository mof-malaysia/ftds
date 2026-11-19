---
title: Section (Astro)
description: The full-width band every marketing block sits in, with the centred column and an optional SectionHeading. Use it for your own blocks so they line up with the rest.
category: Marketing
---

## When to use

- Use `Section` for a custom block on an agency or landing page (a map, a carousel, a list of your own), so its background, column width, spacing and heading match the FTDS blocks, which use it inside.
- Use `SectionHeading` alone when you already have a band and only need the heading.
- Don't nest a `Section` in another one, except with `flush` (for a block inside a tab panel or a column).

## Usage

A `title` needs a `titleId`: the `<section>` is labelled by it. The `aside` slot sits beside the heading on desktop, under it on mobile:

```astro
---
import Section from "@/components/ui/section.astro";
import Link from "@/components/ui/link.astro";
---

<Section
  tone="well"
  title="Kenyataan media"
  titleId="kenyataan-media"
  description="Kenyataan, ucapan dan siaran media daripada Kementerian Kewangan."
>
  <Link slot="aside" href="/media" primary>Lihat semua kenyataan</Link>
  <ul class="gap-stack-md flex flex-col">
    <li><Link href="/media/belanjawan-2027" underline="hover">Belanjawan 2027 dibentangkan di Dewan Rakyat</Link></li>
    <li><Link href="/media/semakan-sst" underline="hover">Semakan cukai jualan dan perkhidmatan</Link></li>
  </ul>
</Section>
```

## Notes

- Alternate `tone="paper"` (default) and `"well"` down a page instead of adding borders between sections; keep `"primary"` for one band that must stand out.
- `width="article"` narrows the column to a reading width. `flush` drops the band's padding and background, for a block inside another column.
- `containerClass` styles the inner column, for example a grid (`containerClass="lg:grid lg:grid-cols-12"`); `class` styles the band.
- The `title` and `description` slots take rich content in place of the props. The section is only labelled when there is a title.
- The band and column classes are `band_cva` and `container_cva` from `@mof-malaysia/ftds-style/variants/section`, if you need them without the component.
- There is no React version; in React, use a `<section>` with your own container and `SectionHeading`.
