---
title: Breadcrumb (Astro)
description: A trail of links showing where the current page sits in the site's hierarchy, with the current page last. Built from an items array.
category: Navigation
---

## When to use

- Use `Breadcrumb` on content pages that sit two or more levels deep: Utama, Perkhidmatan, Pelepasan cukai.
- On inner pages of a marketing site, `PageIntro` renders the breadcrumb for you above the page title.

## Usage

```astro
---
import Breadcrumb from "@/components/ui/breadcrumb.astro";
---

<Breadcrumb
  items={[
    { label: "Utama", href: "/" },
    { label: "Perkhidmatan", href: "/perkhidmatan" },
    { label: "Pelepasan cukai" },
  ]}
/>
```

## Notes

- React's `BreadcrumbItem`, `BreadcrumbLink` and `BreadcrumbPage` parts are one `items` array here, from the top level down. The last item, or any item without `href`, is the current page: `aria-current="page"`, not a link.
- It renders a `<nav>` labelled "Serbuk roti" in BM (the default) or "Breadcrumb" in English; pass `aria-label` to override. `class` goes on the list, as in React.
- Names longer than 200px truncate, with the full name in the `title` tooltip. No container, border or background around the trail.
