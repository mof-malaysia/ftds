---
title: Steps (Astro)
description: How to apply, register or claim, in order: a numbered list of steps on a Sheet panel, each with a title, what to do and an optional link, and a primary action under it.
---

## When to use

- Use `Steps` on a service or campaign page to explain the process before people start: check eligibility, prepare documents, apply.
- Use `Eligibility` for who can apply, and the React `Stepper` for progress through a multi-page form; `Steps` explains, it doesn't track.

## Usage

```astro
---
import Steps from "@/components/blocks/steps.astro";
import Link from "@/components/ui/link.astro";
---

<Steps
  title="Cara memohon"
  steps={[
    { title: "Semak kelayakan anda", description: "Baca siapa yang boleh memohon." },
    { value: "dokumen", title: "Sediakan dokumen anda" },
    { title: "Mohon dalam talian", description: "Kira-kira 15 minit.", link: { label: "Mula sekarang", href: "/mohon" } },
  ]}
  action={{ label: "Mohon sekarang", href: "/mohon" }}
>
  <p slot="dokumen">
    Salinan MyKad dan slip gaji terkini. <Link href="/dokumen" primary>Senarai penuh dokumen</Link>
  </p>
</Steps>
```

## Notes

- The list is an `<ol>`, so screen readers announce the count and order. Numbers sit in primary-wash circles joined by a Hairline.
- Rich step content goes in the slot named after the step's `value` (`step-0`, `step-1` and so on when unset).
- `action` (or the `action` slot) is the primary button under the list. Use it once; step `link`s are plain links.
- The title defaults to "Cara memohon" / "How to apply".
- Templates in `packages/astro/src/templates` that use it: `campaign.astro` and `service-landing.astro`.
