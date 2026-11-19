---
title: Page Intro (Astro)
description: The quiet opening of an inner page (About, Contact, a news article, a publication list), with a breadcrumb, the page's only h1, a description and a meta row.
---

## When to use

- Use `PageIntro` as the first section in `<main>` on every inner page of an agency site.
- Use `Hero` instead on the home page and on campaign or service landing pages, where the opening has to sell an action.

## Usage

```astro
---
import PageIntro from "@/components/blocks/page-intro.astro";
---

<PageIntro
  breadcrumb={[
    { label: "Utama", href: "/" },
    { label: "Berita", href: "/berita" },
    { label: "Belanjawan 2027 dibentangkan" },
  ]}
  eyebrow="Kenyataan media"
  title="Belanjawan 2027 dibentangkan di Dewan Rakyat"
  description="Langkah baharu untuk isi rumah berpendapatan rendah dan perniagaan kecil."
  meta={["10 Oktober 2026", "5 minit bacaan"]}
  width="article"
/>
```

The `search` slot puts a search form under the description, for a listing page:

```astro
---
import PageIntro from "@/components/blocks/page-intro.astro";
import SiteSearch from "@/components/ui/site-search.astro";
---

<PageIntro
  breadcrumb={[{ label: "Utama", href: "/" }, { label: "Penerbitan" }]}
  title="Penerbitan"
  description="Laporan tahunan, garis panduan dan borang Kementerian Kewangan."
>
  <SiteSearch slot="search" action="/penerbitan" />
</PageIntro>
```

## Notes

- `title` is the page's only `h1`. The last `breadcrumb` item is the current page and takes no `href`.
- `meta` items sit in a row with a dot between them; the `meta` slot replaces them, for a `Tag` or a `<time>`.
- `tone` is `well` (default), `paper` or `primary`, the primary wash that carries the site's colour onto inner pages. It is never a solid blue band.
- `width="article"` narrows the text to the reading column of an article under it. The `actions` slot sits beside the title on desktop; the `media` slot takes an image under the text, such as an article's lead photo.
- Templates in `packages/astro/src/templates` that use it: `about.astro`, `contact.astro`, `event.astro`, `news-article.astro`, `news-listing.astro` and `publications.astro`.
