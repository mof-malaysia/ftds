---
title: Link (Astro)
description: A styled anchor for links in text and lists, with options for colour, underline and opening in a new tab that screen readers announce in the page's language.
category: Navigation
---

## When to use

- Use `Link` for links inside text and in lists of links: guidance pages, contact details, related services.
- Use a `Button` with `href` for a call to action such as "Start now".
- `Breadcrumb`, `Footer` and the navigation blocks render their own links; pass them `href`s rather than `Link`s.

## Usage

```astro
---
import Link from "@/components/ui/link.astro";
---

<p>
  Read <Link href="/tax-relief/lifestyle" primary>what counts as a lifestyle purchase</Link>
  before you make a claim.
</p>
<p>
  <Link href="https://www.hasil.gov.my" newTab primary>Lembaga Hasil Dalam Negeri</Link>
</p>
```

## Notes

- Set `primary` for links in body text; without it the link takes the colour of the text around it, which suits links on coloured surfaces and in quiet lists.
- Keep `underline="always"` (the default) in body text so links don't rely on colour alone. Use `hover` or `none` only where the context makes it obvious that it is a link.
- `newTab` opens the link in a new tab with `rel="noopener noreferrer"`, and adds visually hidden text for screen readers: "(dibuka dalam tab baharu)" in BM (the default) or "(opens in a new tab)" in English, from `lang` or the page's `Astro.currentLocale`. React's `Link` adds no text, so this is an Astro difference.
- Write link text that makes sense on its own, never "click here". Links go to pages; for actions on the same page, use a `Button`.
