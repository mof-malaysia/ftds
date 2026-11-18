---
title: Navbar Menu (Astro)
description: One item of the Navbar, as a top-level link or a dropdown. The Navbar renders it for you; install it as a dependency and import its item types.
category: Official site elements
---

## When to use

- Use `Navbar` and pass `items`; it renders a `NavbarMenu` for each one, in the bar and again in the mobile panel. You don't place `NavbarMenu` yourself.
- Import its types to build the `items` array in a separate file, such as your site's navigation config.

## Usage

The item types live in this file:

```astro
---
import Navbar from "@/components/ui/navbar.astro";
import type { NavbarItem } from "@/components/ui/navbar-menu.astro";

const items: NavbarItem[] = [
  { label: "Utama", href: "/" },
  {
    label: "Perkhidmatan",
    href: "/perkhidmatan",
    children: [
      { label: "Bayar bil", href: "/bayar", description: "Saman, yuran dan taksiran" },
      { label: "Jejak permohonan", href: "/jejak", description: "Lihat status permohonan anda" },
    ],
  },
];
---

<Navbar brand={{ title: "Kementerian Kewangan" }} items={items} />
```

## Notes

- The file exports the types NavbarItem, NavbarLink, NavbarGroup and NavbarFeature; the `Navbar` page says what each field does.
- There is no matching React component: React's dropdown parts (`NavbarMenuDropdown`, `NavbarMenuGroup`...) are in `navbar`.
