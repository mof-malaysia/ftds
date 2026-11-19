---
title: Prose (Astro)
description: Styles long-form content from Markdown or a CMS (an article, a policy page, an event description) in the FTDS type scale, without classes on every element.
category: Marketing
---

## When to use

- Use `Prose` around rendered Markdown, MDX or CMS HTML: a news article, an about page, a policy page, an event description.
- Don't use it around components or layouts (cards, grids, blocks); its styles reach every heading, list, link and table inside it.

## Usage

Wrap rendered content, such as a Content Collection entry's `<Content />` (`<Prose as="article"><Content /></Prose>`), or HTML you write yourself:

```astro
---
import Prose from "@/components/ui/prose.astro";
---

<Prose as="article">
  <h2>Siapa yang layak</h2>
  <p>Semua warganegara Malaysia berumur 18 tahun ke atas yang tinggal di Malaysia.</p>
  <h2>Dokumen yang diperlukan</h2>
  <ul>
    <li>Salinan MyKad</li>
    <li>Slip gaji terkini</li>
  </ul>
  <p>Baca <a href="/garis-panduan">garis panduan penuh</a> sebelum memohon.</p>
</Prose>
```

## Notes

- It styles `h2` to `h4`, paragraphs, lists, links, block quotes (on a Well), figures and captions, images, tables, rules and inline code, capped at 70 characters per line. Headings start at `h2`: the page's `h1` is in the `PageIntro` or `Hero` above.
- Links are blue and underlined, with the focus ring. Don't add classes to the content to restyle it.
- There is no React version.
- The `news-article`, `about` and `event` templates use it.
