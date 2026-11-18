---
title: Download List (Astro)
description: Forms, guidelines, reports and other files to download, one row or card per file with its type icon, title, description, and the file type, size and date.
---

## When to use

- Use `DownloadList` for files: the forms a service needs, the attachments of a news article, a publications library.
- Use `LinkList` for pages and websites, and `NewsList` for articles.

## Usage

```astro
---
import DownloadList from "@/components/blocks/download-list.astro";
---

<DownloadList
  description="Isi borang dan bawa bersama MyKad anda."
  files={[
    { title: "Borang permohonan", href: "/fail/borang.pdf", type: "pdf", size: "240 KB", date: "2026-09-01" },
    { title: "Garis panduan permohonan", href: "/fail/panduan.pdf", type: "pdf", size: "1.2 MB", description: "Siapa yang layak dan cara memohon." },
  ]}
/>
```

A publications library sets the files as cards, here inside a tab panel:

```astro
---
import DownloadList from "@/components/blocks/download-list.astro";
---

<DownloadList
  title=""
  layout="cards"
  flush
  files={[
    { title: "Laporan Tahunan 2025", href: "/fail/laporan-2025.pdf", type: "pdf", size: "8.4 MB", date: "2026-06-30", category: "Laporan tahunan" },
    { title: "Data perbelanjaan 2025", href: "/fail/data-2025.xlsx", type: "xlsx", size: "520 KB", category: "Data terbuka" },
  ]}
/>
```

## Notes

- Each row or card is one link (the title, stretched over it), and its accessible name includes the file type and size, so people know what they'll get before they tap.
- `type` is `pdf`, `xlsx`, `csv`, `docx`, `pptx` or `zip`; it picks the icon and the type shown. Write `size` as people read it ("2.4 MB"). `date` is an ISO date, shown in the page's language as a `<time>`.
- The title defaults to "Muat turun" / "Downloads"; pass `""` for none.
- `width="article"` narrows the column to sit under an article. `flush` drops the band and its padding, for a tab panel.
- Templates in `packages/astro/src/templates` that use it: `news-article.astro`, `publications.astro` and `service-landing.astro`.
