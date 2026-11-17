---
title: Footer (Astro)
description: The plain government footer every site needs: one band with the copyright line, an optional "last updated" note and the required links.
category: Official site elements
---

## When to use

- Put a `Footer` at the bottom of every government page, with the copyright line and the required links (privacy policy, disclaimer, accessibility).
- Use `SiteFooter` on agency and landing sites that need columns of links; a `Footer` with `as="div"` can sit under it for the legal row.

## Usage

```astro
---
import Footer from "@/components/ui/footer.astro";
---

<Footer
  owner="Kementerian Kewangan Malaysia"
  meta="Kemas kini terakhir: 28 Okt 2026"
  linksLabel="Undang-undang"
  links={[
    { label: "Dasar privasi", href: "/privasi" },
    { label: "Penafian", href: "/penafian" },
    { label: "Kebolehcapaian", href: "/kebolehcapaian" },
  ]}
/>
```

## Notes

- React's `FooterCopyright`, `FooterMeta`, `FooterLinks` and `FooterLink` parts are props here: `copyright` (the full line) or `owner` (builds "© {year} {owner}. Hak cipta terpelihara"), `meta`, and `links` with `linksLabel`. The `copyright`, `meta` and `links` slots replace those parts; the default slot goes before the links.
- It renders a `<footer>`, the page's contentinfo landmark. Under a `SiteFooter`, pass `as="div"` so the page keeps one.
- The links render as a `<nav>` labelled "Kaki laman" in BM (the default) or "Footer" in English, underlined on hover. A link with `newTab` opens in a new tab and says so to screen readers.
- `tone` is `paper` (default) or `well`. One hairline sits on top; don't add more borders. `containerClass` styles the inner row, centred at 1280px. It is hidden when printing.
