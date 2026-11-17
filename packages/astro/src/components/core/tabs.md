---
title: Tabs (Astro)
description: Switches between views of the same subject on one page, with one underline style and optional counts. Without JavaScript every panel shows, stacked under its label.
category: Navigation
---

## When to use

- Use `Tabs` to split related content about one thing into views people switch between: Overview, Eligibility, Documents on a scheme page.
- Use links for moving between pages; tabs switch panels on the same page.
- Don't hide content people need to compare side by side in different tabs.

## Usage

Each item's panel is the slot named after its `value`:

```astro
---
import Tabs from "@/components/ui/tabs.astro";
---

<Tabs
  items={[
    { value: "overview", label: "Gambaran keseluruhan" },
    { value: "eligibility", label: "Kelayakan" },
    { value: "documents", label: "Dokumen", count: 3 },
  ]}
>
  <div slot="overview">
    <p>Bantuan tunai untuk isi rumah berpendapatan rendah.</p>
  </div>
  <div slot="eligibility">
    <p>Warganegara Malaysia berumur 18 tahun ke atas.</p>
  </div>
  <div slot="documents">
    <p>Salinan MyKad, slip gaji dan bil utiliti.</p>
  </div>
</Tabs>
```

## Notes

- React's `TabsList`, `TabsTrigger` and `TabsContent` parts are an `items` array and named slots here. An item takes `value`, `label`, an optional `count` (a neutral pill beside the label) and `disabled`.
- Without JavaScript the tab list stays hidden and every panel shows under an `h3` of its label, so nothing is lost. The script turns them into tabs: arrow keys, Home and End move between tabs.
- `defaultValue` is the tab open first (the first enabled item by default). There is no controlled `value`.
- `activationMode="automatic"` (default) opens a tab as soon as it gets keyboard focus; use `manual` to open it on Enter or Space instead.
- `size` is `small` (default) or `medium`; `width` is `fit` (default, the hairline stops at the last tab) or `full`.
- There is one tab style: a hairline under the list with a 2px blue underline under the active tab. Don't restyle tabs as pills or boxes. Tab labels are short nouns.
