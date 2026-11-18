---
title: Site Search (Astro)
description: A labelled "search this site" field with a Search button, for agency sites and service landing pages. A plain GET form, so it works without JavaScript.
category: Marketing
---

## When to use

- Use `SiteSearch` to search a whole site, with results on their own page: in a hero, at the top of a help centre or on the results page itself.
- When search needs to run in the page, such as suggestions while the user types, use a React island instead: the Astro RFC's escape hatch for heavy widgets. Render the React `Autocomplete`, or the React `SiteSearch` with `onSearch`, through `@astrojs/react` (`client:load`). No Astro wrapper ships.

## Usage

It is a `<form role="search">` that sends `?q=…` to `action`:

```astro
---
import SiteSearch from "@/components/ui/site-search.astro";
---

<SiteSearch
  action="/carian"
  size="large"
  showLabel
  shortcut
  placeholder="Contoh: pelepasan cukai, status bayaran balik"
/>
```

On a results page, start with the query from the address, and send extra fields with `params`:

```astro
---
import SiteSearch from "@/components/ui/site-search.astro";

const query = Astro.url.searchParams.get("q") ?? undefined;
---

<SiteSearch
  action="/carian"
  defaultValue={query}
  labels={{ label: "Cari dalam berita" }}
  params={{ koleksi: "berita" }}
/>
```

## Notes

- The same props as the React `SiteSearch`, with `class` for `className`, except `onSearch`: an Astro page handles the query with the GET request, or with a page script listening for the form's `submit` or the field's `input` event.
- `params` (Astro only) adds hidden inputs sent with the query; an array sends the name once per value.
- The label is always there for screen readers ("Cari dalam laman ini" in BM, the default, or "Search this site"); `showLabel` makes it visible. `labels` replaces the label and the button text ("Cari").
- `size="large"` suits a hero.
- `shortcut` makes "/" focus the field (except while typing in another field) and shows a key hint; use it on one search per page at most. Escape leaves an empty field.
- The placeholder is an example, not the label: start it with "Contoh:".
- The Search button is a filled primary button. If the page already has a primary action, don't add another filled blue button beside it.
