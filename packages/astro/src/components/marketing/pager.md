---
title: Pager (Astro)
description: Previous, page numbers and next for a static listing such as news or publications. Every page is a plain link, so it works with Astro's paginate() and no JavaScript.
category: Navigation
---

## When to use

- Use `Pager` under a listing split over several static pages: news, press releases, publications.
- Use a "Lihat semua" link instead when a short list on a home page only needs to point to the full listing.
- For paging inside an app without page loads, use the React `Pagination` as an island; there is no React `Pager`.

## Usage

With Astro's `paginate()` and a rest route (`src/pages/berita/[...page].astro`), page 1 is `/berita` and the rest are `/berita/2`, `/berita/3`, so pass `firstHref`:

```astro
---
import type { GetStaticPaths, Page } from "astro";
import Pager from "@/components/ui/pager.astro";

interface Article {
  title: string;
  href: string;
}

export const getStaticPaths = (async ({ paginate }) => {
  const articles: Article[] = [
    { title: "Belanjawan 2027 dibentangkan", href: "/berita/belanjawan-2027" },
    { title: "Semakan cukai jualan dan perkhidmatan", href: "/berita/semakan-sst" },
  ];
  return paginate(articles, { pageSize: 10 });
}) satisfies GetStaticPaths;

interface Props {
  page: Page<Article>;
}

const { page } = Astro.props;
---

<ul>
  {page.data.map((article) => <li><a href={article.href}>{article.title}</a></li>)}
</ul>
<Pager current={page.currentPage} total={page.lastPage} href="/berita/{n}" firstHref="/berita" />
```

## Notes

- `href` is a pattern with `{n}` for the page number, or a function `(page) => string`. `firstHref` gives page 1 its own URL.
- It shows the first and last pages, `siblings` pages (default 1) each side of the current one, and an ellipsis for a gap of two or more pages. Previous and next only show when there is a page to go to, and carry `rel="prev"` / `rel="next"`.
- The current page has `aria-current="page"` and each number is named "Halaman 3". The `<nav>` is labelled "Penomboran halaman" in BM (the default) or "Pagination" in English; pass `aria-label` to name it yourself.
- It renders nothing when `total` is 1 or less.
- The `news-listing` template ends with a `Pager`.
