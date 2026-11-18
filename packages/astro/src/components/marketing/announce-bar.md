---
title: Announce Bar (Astro)
description: A one-line notice with a tag at the top of an agency site, such as planned maintenance or a new feature. For a service's alpha or beta phase, use PhaseBanner.
category: Marketing
---

## When to use

- Use `AnnounceBar` for a short, site-wide notice on an agency or landing site: planned maintenance, a new service, a changed deadline. Put it at the top of the page with the site chrome.
- Use `PhaseBanner` to say a service is in alpha or beta and ask for feedback.
- Use `Callout` for a message about the content of one page.

## Usage

`tag` and `tagVariant` build the `Tag`; the default slot is the message:

```astro
---
import AnnounceBar from "@/components/ui/announce-bar.astro";
import Link from "@/components/ui/link.astro";
---

<AnnounceBar tag="Penyelenggaraan" tagVariant="warning">
  <p>
    Pembayaran dalam talian tidak tersedia pada 2 November dari 1 pagi hingga 4 pagi.
    <Link href="/notis/penyelenggaraan" primary>Baca notis</Link>
  </p>
</AnnounceBar>
```

## Notes

- React's `AnnounceBarTag` and `AnnounceBarDescription` parts are the `tag` and `tagVariant` props and the default slot here. `tagVariant` takes the core `Tag` variants, and the `tag` slot replaces the built `Tag` when you need your own.
- `border` (on by default) draws a Hairline under the bar. Pass `border={false}` when it sits directly above another rule.
- The bar has side margins but no maximum width; to line it up with a centred page, place it inside your page's max-width container. The `site-layout` template takes it in its `announce` slot, between the `Masthead` and the `Navbar`.
- The tag text labels the notice, so make it a word that stands on its own ("Penyelenggaraan", "Baharu"). Don't rely on the tag's colour alone.
- Keep the message to one sentence and at most one link, and remove the bar when the notice no longer applies.
