---
title: Cookie Banner (Astro)
description: A panel in the corner of the page that asks for consent to analytics cookies, saves the choice and announces it with an event. Hidden for visitors without JavaScript.
category: Official site elements
---

## When to use

- Show a `CookieBanner` when the site sets cookies that aren't strictly necessary, such as analytics. If the site only uses essential cookies, you don't need one; explain them on the cookies page instead.
- Use `Callout` or `AnnounceBar` for other site-wide messages.

## Usage

Put it once in the site layout, and load analytics only after consent:

```astro
---
import CookieBanner from "@/components/ui/cookie-banner.astro";
import Link from "@/components/ui/link.astro";
---

<CookieBanner>
  Kami menggunakan kuki yang perlu untuk laman web ini berfungsi, dan ingin menggunakan kuki analitik.
  <Link href="/kuki" primary>Baca dasar kuki kami</Link>.
</CookieBanner>

<script>
  const load = () => {
    // Load your analytics script here
  };
  if (localStorage.getItem("ftds-cookie-consent") === "accepted") load();
  document.addEventListener("ftds:cookie-consent", (event) => {
    if ((event as CustomEvent<{ value: string }>).detail.value === "accepted") load();
  });
</script>
```

## Notes

- Accepting or declining saves `"accepted"` or `"declined"` in localStorage under `storageKey` (default `ftds-cookie-consent`), closes the banner and dispatches `ftds:cookie-consent` on `document` with `detail.value`. React's `CookieBanner` leaves saving to you; this one does it.
- The banner renders `hidden` and the script shows it only when no choice is saved, so a visitor without JavaScript never sees a banner they can't close (and no analytics load for them).
- It is not modal: the page stays usable behind it. Esc and the ✕ close it for this page view without saving a choice; treat that as "no consent yet".
- With no props, every text is the dictionary's, in the page's language (BM by default). Override with `title`, `description`, `acceptLabel`, `declineLabel` and `closeLabel`, or the `title` slot and the default slot. The `actions` slot adds links after the two buttons.
- Accept and reject are equally easy: same style, same size, side by side. Keep it that way. There is no preferences view in the Astro version.
