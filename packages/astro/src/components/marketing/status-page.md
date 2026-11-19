---
title: Status Page (Astro)
description: The whole-page message for a page that can't be shown, not found (404), server error (500) or maintenance (503), in plain words with what to do next.
---

## When to use

- Use `StatusPage` for an Astro site's `404.astro` and `500.astro` pages, and for the maintenance page served while the site is down.
- Use `Callout` for a problem with part of a page, and the React `ErrorPage` in a React service.

## Usage

Put it in the site layout, so the masthead, navbar and footer stay and people can find their way on. The default slot sits under the text:

```astro
---
import StatusPage from "@/components/blocks/status-page.astro";
import Link from "@/components/ui/link.astro";
---

<StatusPage kind="not-found" homeHref="/" supportHref="/hubungi">
  <ul>
    <li><Link href="/bayar" primary>Bayar bil kerajaan</Link></li>
    <li><Link href="/penerbitan" primary>Penerbitan</Link></li>
  </ul>
</StatusPage>
```

A maintenance page says when the site will be back:

```astro
---
import StatusPage from "@/components/blocks/status-page.astro";
---

<StatusPage kind="maintenance" backAt="4.00 pagi, 2 November 2026" />
```

## Notes

- `kind` sets the title, explanation and status code, in BM or English, worded as the React `ErrorPage`. `title` and `description` replace them; `code={null}` hides the code.
- The title is the page's only `h1`. The status code sits small above it: it helps support staff, not the reader.
- `homeHref` adds "Pergi ke laman utama" / "Go to the home page" (the filled primary action); `supportHref` adds "Hubungi kami" / "Contact us". The `actions` slot replaces both, and the `media` slot takes an illustration above the code.
- Serve the maintenance page with a 503 status and a `Retry-After` header, on its own rather than in the full site layout.
- Templates in `packages/astro/src/templates` that use it: `maintenance.astro` and `not-found.astro`.
