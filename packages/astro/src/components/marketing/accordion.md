---
title: Accordion (Astro)
description: A stack of sections that open and close under their headings, built on native details elements. Opens one at a time by default, and works without JavaScript.
category: Marketing
---

## When to use

- Use `Accordion` for several related sections a reader opens one at a time: eligibility rules by category, the steps of a long guide, sections of a policy page.
- Use `Details` for one short piece of help only some people need, such as "Help with your IC number".
- Use the `Faq` block for a whole frequently asked questions section; it builds the accordion, heading and contact line for you.
- Use `Tabs` when the sections are alternative views of the same thing.
- Don't hide information everyone needs to complete a task inside a closed section.

## Usage

Plain-text sections take `content`. For rich content, give the item a `value` and put the content in the slot of that name:

```astro
---
import Accordion from "@/components/ui/accordion.astro";
---

<Accordion
  defaultValue="gaya-hidup"
  items={[
    {
      value: "gaya-hidup",
      title: "Pelepasan gaya hidup, sehingga RM 2,500",
      content: "Buku, komputer peribadi, telefon pintar atau tablet, langganan internet dan yuran kursus kemahiran.",
    },
    {
      value: "perubatan",
      title: "Pelepasan perubatan, sehingga RM 10,000",
    },
  ]}
>
  <ul slot="perubatan" class="list-disc pl-6">
    <li>Rawatan penyakit serius</li>
    <li>Rawatan kesuburan</li>
    <li>Vaksinasi untuk anda, pasangan atau anak anda</li>
  </ul>
</Accordion>
```

## Notes

- React's `AccordionItem`, `AccordionTrigger` and `AccordionContent` parts are an `items` array here. An item's `value` (default `item-0`, `item-1`...) is also its slot name.
- `type="multiple"` lets several sections stay open; `defaultValue` then takes an array (`defaultValue={["sebelum", "selepas"]}`).
- Each item is a native `<details>` with the title as its `<summary>`, so it opens with JavaScript off, from the keyboard (Enter or Space) and with the browser's find-in-page. No script ships.
- `type="single"` (default) groups the items with `<details name>`, so the browser keeps one open. There is no `collapsible` prop: unlike React, an open item can always be closed by its own title.
- There is no controlled `value` or `onValueChange`; listen for the native `toggle` event on the `<details>` if you need one.
- `itemClass`, `triggerClass` and `contentClass` style each `<details>`, `<summary>` and content box; `class` styles the wrapper.
- Items sit on a Sheet (`bg-bg-white`) with a Hairline under each. Don't wrap the accordion in a bordered box.
