---
title: FAQ (Astro)
description: Common questions and answers, as a heading and intro beside an accordion of native details elements, with an optional "still need help" contact line.
---

## When to use

- Use `Faq` near the end of a service, campaign, event or contact page for the questions people ask most.
- Use `Accordion` on its own for collapsible content that isn't questions, and `Details` for a single optional explanation.
- Don't hide information everyone needs in an answer; put it on the page.

## Usage

An answer is the item's `answer` text or, for rich content, the slot named after its `value`:

```astro
---
import Faq from "@/components/blocks/faq.astro";
import Link from "@/components/ui/link.astro";
---

<Faq
  items={[
    { question: "Siapa yang boleh memohon?", answer: "Warganegara Malaysia berumur 18 tahun ke atas." },
    { value: "dokumen", question: "Apakah dokumen yang saya perlukan?" },
  ]}
>
  <ul slot="dokumen">
    <li>Salinan MyKad</li>
    <li>Slip gaji terkini</li>
  </ul>
  <Fragment slot="contact">
    Masih perlukan bantuan? <Link href="/hubungi" primary>Hubungi kami</Link>
  </Fragment>
</Faq>
```

## Notes

- The answers are native `<details>`, so they open and close with JavaScript off. Only one is open at a time (the browser groups them with `<details name>`, no script) unless `multiple` is set; `defaultOpen` takes the `value` of the item open on first load.
- An item's `value` defaults to `faq-0`, `faq-1` and so on. Set your own when you fill its slot, so reordering items doesn't move answers.
- The title defaults to "Soalan lazim" / "Frequently asked questions" in the page's language. `contact` (or the `contact` slot) is the "still need help" line under the intro.
- The intro sits beside the questions on desktop and above them on phones.
- Templates in `packages/astro/src/templates` that use it: `campaign.astro`, `contact.astro`, `event.astro` and `service-landing.astro`.
