---
title: Navbar (Astro)
description: The site's top navigation bar: logo, links and dropdown menus, and actions such as the language switcher, with a full-width menu panel on tablet and mobile. Built on popovers.
category: Official site elements
---

## When to use

- Use `Navbar` as the main navigation of an agency or landing site, and of a citizen service with more than a couple of sections. It goes under the `Masthead` (and `PhaseBanner`, if any).
- Use `Breadcrumb` to show where a page sits in a deep hierarchy.
- In the bar, a search icon button that links to the search page keeps it uncluttered; put a `SiteSearch` on the results page or in a hero.

## Usage

`brand` is the logo and site title, linking home. `items` are the links and dropdowns (an item with `children` or `groups` opens one). The `actions` slot holds your actions:

```astro
---
import Navbar from "@/components/ui/navbar.astro";
import Button from "@/components/ui/button.astro";
import LanguageSwitcher from "@/components/ui/language-switcher.astro";
import Search from "@/components/ui/icons/search.astro";
---

<Navbar
  brand={{ title: "Kementerian Kewangan", logo: { src: "/jata-negara.png", alt: "Jata Negara" } }}
  items={[
    { label: "Utama", href: "/", current: true },
    { label: "Mengenai kami", href: "/mengenai" },
    {
      label: "Agensi",
      href: "/agensi",
      children: [
        { label: "Lembaga Hasil Dalam Negeri", href: "/agensi/lhdn" },
        { label: "Jabatan Kastam Diraja Malaysia", href: "/agensi/jkdm" },
      ],
    },
    { label: "Hubungi kami", href: "/hubungi" },
  ]}
>
  <Fragment slot="actions">
    <Button href="/carian" variant="default-ghost" iconOnly aria-label="Cari dalam laman ini">
      <Search aria-hidden="true" />
    </Button>
    <LanguageSwitcher
      locales={[
        { code: "ms", href: "/ms" },
        { code: "en", href: "/en" },
      ]}
    />
  </Fragment>
</Navbar>
```

Links can say what is behind them (`description` and `icon`), sit in titled `groups`, and a dropdown can highlight one `feature` and end with a `footer` link:

```astro
---
import Navbar from "@/components/ui/navbar.astro";
import Money from "@/components/ui/icons/money.astro";
import Document from "@/components/ui/icons/document.astro";

const brand = { title: "Kementerian Kewangan", logo: { src: "/jata-negara.png", alt: "Jata Negara" } };
---

<Navbar
  brand={brand}
  items={[
    {
      label: "Perkhidmatan",
      current: true,
      children: [
        { label: "Bayar bil", href: "/bayar", description: "Saman, yuran dan taksiran", icon: Money, current: true },
        { label: "Dapatkan resit", href: "/resit", description: "Muat turun atau cetak semula resit rasmi", icon: Document },
      ],
    },
    {
      label: "Untuk anda",
      footer: { label: "Semua perkhidmatan", href: "/perkhidmatan" },
      groups: [
        { title: "Untuk rakyat", links: [{ label: "Pelepasan cukai", href: "/pelepasan" }] },
        { title: "Untuk perniagaan", links: [{ label: "Pendaftaran pembekal", href: "/pembekal" }] },
      ],
    },
    {
      label: "Penerbitan",
      href: "/penerbitan",
      feature: {
        href: "/belanjawan-2027",
        eyebrow: "Baharu",
        title: "Belanjawan 2027 telah dibentangkan",
        description: "Maksudnya untuk isi rumah dan perniagaan kecil.",
      },
      children: [
        { label: "Dokumen belanjawan", href: "/penerbitan/belanjawan" },
        { label: "Pekeliling perbendaharaan", href: "/penerbitan/pekeliling" },
      ],
    },
  ]}
/>
```

## Notes

- React's `NavbarLogo`, `NavbarMenu`, `NavbarMenuItem`, `NavbarMenuDropdown`, `NavbarMenuGroup`, `NavbarMenuFeature` and `NavbarMenuFooterLink` parts are the `brand` and `items` props here, and `NavbarAction` is the `actions` slot. React's `active` is `current`, and a dropdown's `title` is its `label`. The types of `items` are exported from `navbar-menu.astro` (see `NavbarMenu`).
- The menu button for tablet and mobile is added for you whenever there are `items`. There is no `menuLabel` prop: it is named "Menu" ("Tutup" while open) in BM (the default) or English, and the `<nav>` "Navigasi utama" or "Main navigation".
- From `xl` (1280px) the links sit in the bar and dropdowns open beside their trigger. Below it they move into a full-width panel under the bar, where dropdowns expand in place.
- Dropdowns and the mobile panel are popovers, so they open, close on Escape or an outside click, and return focus without JavaScript. Mobile sections are `<details>`, open when the visitor is in that section.
- The script adds positioning where CSS anchor positioning is missing, `aria-expanded`, arrow keys inside a dropdown, and focus into the mobile panel.
- `current` sets `aria-current="page"` on a link and underlines its top-level item; a dropdown is underlined when it or any of its links is `current`.
- An item with both `href` and a dropdown gets a footer link "Lihat semua: {label}" to its `href`, unless you set `footer`, so its section page is always one link away.
- `columns` (1, 2 or 3) lays plain `children` out in columns; `groups` always sit side by side. Use described links for 3 to 6 links and groups with a footer for 10 or more.
- A brand title longer than `brand.maxChars` (19 by default) is set smaller over two lines. The `logo` slot replaces the `<img>`.
- `icon` takes an FTDS Astro icon component, shown in a tile. `feature` is text on a Well, never an image; use one per dropdown at most.
- The bar is sticky; keep only a few actions in the `actions` slot. The `site-layout` template shows it with the rest of the site chrome.
