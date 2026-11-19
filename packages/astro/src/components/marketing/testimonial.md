---
title: Testimonial (Astro)
description: What people say about a service: one quote as a large centred pull quote, or two or three as a grid of Sheet panels, each with the person's name, role and avatar.
---

## When to use

- Use `Testimonial` on a campaign or landing page, where a real user's words make the case better than the agency's.
- Use `PeopleGrid` to introduce staff or leaders. Only quote real people, with their consent.

## Usage

```astro
---
import Testimonial from "@/components/blocks/testimonial.astro";
---

<Testimonial
  items={[
    {
      quote: "Saya mendaftar semasa rehat tengah hari. Invois pertama saya disahkan dalam beberapa saat.",
      name: "Nurul Aina",
      role: "Pemilik kedai bunga, Shah Alam",
    },
  ]}
/>
```

## Notes

- One quote renders as a large centred pull quote; two or three as a grid of Sheet panels. Extra items are dropped.
- Each quote is a `<figure>` with a `<blockquote>` and a `<figcaption>` naming the person. `avatar` is decorative, since the name is beside it.
- `title` (or the `title` slot) adds a section heading above the quotes.
- Templates in `packages/astro/src/templates` that use it: `campaign.astro`.
