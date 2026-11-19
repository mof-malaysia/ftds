---
title: News List (Astro)
description: The latest news, press statements and announcements, newest first, as image cards for a home page, rows for a listing page, or dated headlines for a side panel.
---

## When to use

- Use `NewsList` with `layout="grid"` (default) on a home page, `list` on the news listing page, and `compact` for an announcements panel beside other content or related articles.
- Use `DownloadList` for files and `LinkList` for other pages.

## Usage

```astro
---
import NewsList from "@/components/blocks/news-list.astro";
---

<NewsList
  items={[
    { title: "Belanjawan 2027 dibentangkan", href: "/berita/belanjawan-2027", date: "2026-10-10", category: "Kenyataan media", image: "/images/belanjawan.jpg" },
    { title: "Pembayaran fasa ketiga STR bermula", href: "/berita/str-fasa-3", date: "2026-08-01", category: "Pengumuman", categoryVariant: "primary" },
  ]}
  viewAll={{ label: "Semua berita", href: "/berita" }}
/>
```

A listing page puts a `Pager` in the default slot:

```astro
---
import NewsList from "@/components/blocks/news-list.astro";
import Pager from "@/components/ui/pager.astro";
---

<NewsList
  title=""
  layout="list"
  items={[
    { title: "Belanjawan 2027 dibentangkan", href: "/berita/belanjawan-2027", date: "2026-10-10", summary: "Langkah baharu untuk isi rumah dan perniagaan kecil." },
  ]}
>
  <Pager current={1} total={12} href="/berita/{n}" firstHref="/berita" />
</NewsList>
```

## Notes

- Every item is one link (its title, stretched over the card or row). Its `category` is a `Tag` (`categoryVariant` sets the colour) and its `date`, an ISO date, is shown in the page's language as a `<time>`.
- `grid` shows up to three Sheet cards; `list` shows every item with a thumbnail and summary; `compact` shows dated headlines only. Images are decorative: the title is the label.
- The title defaults to "Berita dan pengumuman" / "News and announcements"; pass `""` for none. `viewAll` adds a link to the full listing beside it.
- Templates in `packages/astro/src/templates` that use it: `agency-home.astro`, `news-article.astro` and `news-listing.astro`.
