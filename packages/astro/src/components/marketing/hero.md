---
title: Hero (Astro)
description: The opening section of an agency, service or campaign page, with the page's only h1, supporting text, up to two actions and optional media beside or behind the text.
---

## When to use

- Use `Hero` as the first section in `<main>` on a home, service landing or campaign page, after the `Masthead` and `Navbar`.
- Use `PageIntro` on inner pages (About, Contact, a news article), `SectionHeading` for headings further down the page, and `CtaBand` for the closing call to action.

## Usage

Actions take `{ label, href }` and render large `Button` links: the primary one filled, the secondary one tonal. Put the picture in the `media` slot:

```astro
---
import Hero from "@/components/blocks/hero.astro";
---

<Hero
  eyebrow="Permohonan dibuka"
  title="Sumbangan Tunai Rahmah"
  description="Bantuan tunai sehingga RM 2,000 setahun untuk isi rumah berpendapatan rendah."
  primaryAction={{ label: "Mohon sekarang", href: "/mohon" }}
  secondaryAction={{ label: "Semak kelayakan", href: "#kelayakan" }}
  footnote="Permohonan ditutup pada 31 Disember 2026."
>
  <img slot="media" src="/images/str.jpg" width="1200" height="675" alt="" />
</Hero>
```

For anything other than two links, fill the `actions` slot yourself; the default slot sits under the actions, for a search form or quick links:

```astro
---
import Hero from "@/components/blocks/hero.astro";
import Button from "@/components/ui/button.astro";
---

<Hero title="Belanjawan 2027" description="Apa maksud belanjawan untuk isi rumah dan perniagaan kecil." align="center">
  <Fragment slot="actions">
    <Button size="large" href="/belanjawan-2027/ringkasan">Baca ringkasan</Button>
  </Fragment>
</Hero>
```

## Notes

- `title` is the page's only `h1`, and the section is labelled by it. Don't add another `h1`.
- Without media the hero is `stacked` (left aligned, or centred with `align="center"`). With media it defaults to `split`: text and media side by side on desktop, `mediaPosition` picks the side, media last on mobile.
- `layout="image"` fills the band with the picture and keeps the text on a solid panel over it, so contrast never depends on the photo; on mobile the picture sits above the text. It is usually the page's largest paint: give the `<img>` a `srcset` with `sizes="100vw"` and `fetchpriority="high"`, and don't lazy-load it.
- `tone` is `paper` (default), `well` or `primary` (the primary wash). On `image` it colours the panel. There is no solid blue band and no gradient.
- One filled blue button per hero: the primary action. If you fill the `actions` slot, keep the secondary action tonal or ghost, never filled.
- Give decorative images `alt=""`. Put the reassurance a nervous user needs (how long it takes, what to have ready) in `footnote`.
- Templates in `packages/astro/src/templates` that use it: `agency-home.astro`, `service-landing.astro` and `campaign.astro`.
