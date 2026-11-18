---
title: Link List (Astro)
description: Points people to related pages, services and other websites, one row per link with its label, an optional line on what they'll find, and an arrow.
---

## When to use

- Use `LinkList` for "Pautan berkaitan", a service's other pages, or a list of agencies' websites.
- Use `DownloadList` for files, so people see the type and size, and `ServiceHighlights` for the main services on a home page.

## Usage

```astro
---
import LinkList from "@/components/blocks/link-list.astro";
---

<LinkList
  title="Pautan berkaitan"
  width="article"
  links={[
    { label: "Semak status permohonan", href: "/semak", description: "Dengan nombor rujukan anda." },
    { label: "Portal MyGov", href: "https://www.malaysia.gov.my", external: true },
  ]}
/>
```

## Notes

- Each row is one link (the label, stretched over the row). Write labels that make sense out of context: "Semak status permohonan", not "Klik di sini".
- An `external` link gets an outgoing arrow and "(laman web luar)" / "(external website)" in its accessible name, and opens in the same tab.
- `layout="cards"` sets the links in a grid of Sheet cards. `width="article"` narrows the column to sit under an article, and `flush` drops the band and its padding, for a tab panel.
- No template uses it yet; see Marketing › Link List in the Astro Storybook.
