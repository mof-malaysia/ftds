---
title: Inset Text (Astro)
description: Sets a passage apart from the text around it, such as a deadline, a requirement or a quote, on a grey Well with no icon.
category: Data display
---

## When to use

- Use `InsetText` to make one passage stand out from the body text: a deadline, a condition, an example, a quote.
- Use `Callout` for a status or warning that needs an icon and colour, and `Details` for help that only some users need.
- Use it sparingly: if everything is inset, nothing stands out.

## Usage

```astro
---
import InsetText from "@/components/ui/inset-text.astro";
---

<InsetText>
  Anda mesti menghantar borang sebelum 30 April 2026 untuk mengelakkan penalti lewat.
</InsetText>

<InsetText author="Kementerian Kewangan Malaysia">
  Setiap ringgit wang awam mesti dibelanjakan dengan berhati-hati.
</InsetText>
```

## Notes

- With `author` (or the `author` slot) it becomes a quote: a `<figure>` with the text in a `<blockquote>` and the author in a `<figcaption>`.
- `as` changes the element (`div` by default, or `aside`, `figure`, `section`), where React uses `render`.
- It is a Well (`bg-bg-washed`) with padding and rounded corners, no border and no side stripe. Text is capped at about 70 characters per line.
