---
title: Section Heading (Astro)
description: The h2 title and intro paragraph used by the marketing blocks. Use it to give your own landing page sections the same heading style.
category: Marketing
---

## When to use

- Use `SectionHeading` at the top of a custom section on an agency or landing page so it matches the FTDS blocks, which use it inside.
- Use `Section` instead when you also need the band and centred column; it renders a `SectionHeading` from its `title` and `description`.
- Don't use it for the page title: the page's only `h1` comes from the `Hero` or `PageIntro` block.

## Usage

Give the heading an id with `titleId` and point the section's `aria-labelledby` at it:

```astro
---
import SectionHeading from "@/components/ui/section-heading.astro";
import Link from "@/components/ui/link.astro";
---

<section aria-labelledby="pusat-media">
  <SectionHeading
    titleId="pusat-media"
    title="Pusat media"
    description="Kenyataan media, ucapan dan siaran daripada Kementerian Kewangan."
    class="max-w-[720px]"
  >
    <Link href="/media" primary>Lihat semua kenyataan media</Link>
  </SectionHeading>
  <p class="text-content text-txt-black-700">Tiada kenyataan baharu minggu ini.</p>
</section>
```

## Notes

- The same props as the React `SectionHeading`, with `class` for `className`. The `title` and `description` slots take rich content in place of the props, and the default slot renders under the intro, for a link or a short contact line.
- `as` is `"h2"` (default) or `"h3"` for a subsection inside a section that already has an `h2`.
- Pass `responsive={false}` for a fixed `text-headline` title that doesn't step up from `md`.
- It renders nothing when the title, description and default slot are all empty, so blocks with an optional title leave no gap.
- There is no `renderAction` helper as in React; put a `Button` or `Link` in the default slot.
