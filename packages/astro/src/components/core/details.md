---
title: Details (Astro)
description: A link-like toggle that reveals a short piece of help, such as "Help with your IC number". A native details element that works without JavaScript.
category: Data display
---

## When to use

- Use `Details` to hide help that most people don't need, so the page stays short: where to find a reference number, what counts as a dependant.
- Use `Accordion` for several sections that open and close (FAQ, long guidance), and `InsetText` for a passage everyone must read.
- Don't hide information that is needed to complete the task.

## Usage

```astro
---
import Details from "@/components/ui/details.astro";
---

<Details summary="Saya tidak menjumpai nombor rujukan saya">
  Nombor rujukan anda ada pada surat yang kami hantar kepada anda, di bawah nama anda.
</Details>
```

## Notes

- It is a native `<details>` with the trigger as its `<summary>`, so it opens and closes with JavaScript off, and the browser's find-in-page can open it.
- `summary` (or the `summary` slot) is the trigger; write it as the user's question or problem, not "More information". The default slot is the help.
- `open` starts it open. There is no `onOpenChange`; listen for the native `toggle` event if you need one.
- The content sits in a Well (`bg-bg-washed`) capped at about 70 characters per line; `contentClass` styles that box and `class` the `<details>`.
