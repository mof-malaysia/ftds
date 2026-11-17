---
title: Callout (Astro)
description: A wash-coloured message with an icon for information, success, a warning or an error about the current page. It can carry actions and be dismissed.
category: Feedback and status
---

## When to use

- Use `Callout` for a message about the page or the task in hand: "Applications close on 30 April", "Online services will be down on Saturday night".
- Use `InsetText` for a passage set apart with no status, and `PhaseBanner` or `AnnounceBar` for site-wide notices across the top of every page.

## Usage

```astro
---
import Callout from "@/components/ui/callout.astro";
import Button from "@/components/ui/button.astro";
---

<Callout variant="warning" title="Butiran anda tidak sepadan dengan rekod kami">
  Nama yang anda masukkan berbeza daripada nama pada MyKad anda.
  <Button slot="actions" variant="default-outline" href="/profile">Semak butiran saya</Button>
</Callout>

<Callout title="Permohonan dibuka sehingga 30 April 2026" dismissible />
```

## Notes

- `variant` is `info` (default), `success`, `warning` or `danger`; the icon follows it. The title and text must still say what happened, so colour is never the only signal.
- A `danger` callout has `role="alert"`, announced straight away; the others have `role="status"`. Avoid stacking several on one page.
- `title` (or the `title` slot) is the bold line, the default slot the text under it, and the `actions` slot holds buttons. A title alone is fine.
- `dismissible` adds a ✕ button that removes the callout and moves focus to the next focusable element. It needs JavaScript, so the button appears only once the script runs; without it the callout simply stays. Its name is "Tutup" in BM (the default) or "Dismiss" in English; pass `dismissLabel` to change it. Dismissing is not remembered across page loads.
- The callout is a wash with no border and no side stripe. Don't add either.
