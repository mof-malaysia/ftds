---
title: People Grid (Astro)
description: An agency's leadership or a team, with a photo or initials, each person's name, position, an optional short bio and profile link; the first few can be featured.
---

## When to use

- Use `PeopleGrid` on an About or leadership page, or for the contact people of a programme.
- Use `PartnerGrid` for organisations, and `Testimonial` for what people say about a service.

## Usage

```astro
---
import PeopleGrid from "@/components/blocks/people-grid.astro";
import Link from "@/components/ui/link.astro";
---

<PeopleGrid
  title="Kepimpinan"
  featured={1}
  people={[
    { name: "Datuk Seri Ahmad bin Ali", role: "Menteri Kewangan", photo: "/images/menteri.jpg", bio: "Dilantik pada Disember 2022.", href: "/kepimpinan/menteri" },
    { name: "Puan Siti Aminah", role: "Ketua Setiausaha Perbendaharaan" },
    { name: "Encik Lim Wei Jie", role: "Timbalan Ketua Setiausaha (Dasar)" },
  ]}
>
  <Link href="/carta-organisasi" primary>Carta organisasi</Link>
</PeopleGrid>
```

## Notes

- `featured` is how many of the first people (the minister, the secretary-general) get a wider card on their own row. Defaults to 0.
- Photos are decorative, since the name is beside them. Without a photo, the person's initials show on a primary wash, leaving out honorifics and "bin" / "binti".
- `href` makes the name a link to a profile page. Each name is an `h3` under the section title (an `h2` without one).
- The default slot sits under the grid, for a link to the organisation chart.
- Templates in `packages/astro/src/templates` that use it: `about.astro`.
