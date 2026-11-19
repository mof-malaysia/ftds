---
title: Eligibility (Astro)
description: Tells people before they start whether they can apply: a checklist of what they must meet and, optionally, what rules them out, each under its own heading.
---

## When to use

- Use `Eligibility` on a service or scheme page, before `Steps` and the apply action, so people who can't apply find out before they start.
- Use `Steps` for how to apply, and `Callout` for a single important condition that changes.

## Usage

Write each criterion to complete its heading: "Anda boleh memohon jika anda" ... "warganegara Malaysia".

```astro
---
import Eligibility from "@/components/blocks/eligibility.astro";
---

<Eligibility
  id="kelayakan"
  description="Semak sebelum anda memohon. Permohonan yang tidak layak akan ditolak."
  criteria={["warganegara Malaysia", "berumur 18 tahun ke atas", "berpendapatan isi rumah RM 5,000 sebulan atau kurang"]}
  exclusions={["sudah menerima Sumbangan Tunai Rahmah tahun ini"]}
  note="Tidak pasti? Hubungi 03-8000 8000 sebelum anda memohon."
/>
```

## Notes

- Criteria and exclusions each have their own heading, so the meaning never rests on the tick or the cross alone. The defaults are "Anda boleh memohon jika anda" and "Anda tidak boleh memohon jika anda" (English: "You can apply if you", "You can't apply if you"); change them with `criteriaTitle` and `exclusionsTitle`.
- The section title defaults to "Siapa yang layak" / "Who can apply".
- `note` (or the `note` slot) is the closing line: exceptions, or where to ask.
- Give it an `id` so the hero's "check eligibility" link can jump to it.
- Templates in `packages/astro/src/templates` that use it: `service-landing.astro`.
