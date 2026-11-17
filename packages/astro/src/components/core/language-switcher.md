---
title: Language Switcher (Astro)
description: Links to the same page in each language the site has (BM and EN), marking the current one. Plain links, so it works without JavaScript.
category: Navigation
---

## When to use

- Use `LanguageSwitcher` on sites published in both Bahasa Melayu and English. It fits the `Navbar`'s `actions` slot.
- Each link goes to the same page in the other language, not to the home page.

## Usage

Pass the href of the current page in each language. With Astro's i18n routing configured, build them with `getRelativeLocaleUrl`:

```astro
---
import { getRelativeLocaleUrl } from "astro:i18n";
import LanguageSwitcher from "@/components/ui/language-switcher.astro";

const path = Astro.url.pathname.replace(/^\/(en|ms)(?=\/|$)/, "");
const locales = (["ms", "en"] as const).map((code) => ({
  code,
  href: getRelativeLocaleUrl(code, path),
}));
---

<LanguageSwitcher locales={locales} />
```

Without i18n routing, write the hrefs yourself:

```astro
---
import LanguageSwitcher from "@/components/ui/language-switcher.astro";
---

<LanguageSwitcher
  current="en"
  locales={[
    { code: "ms", href: "/ms/perkhidmatan" },
    { code: "en", href: "/en/services" },
  ]}
/>
```

## Notes

- The current language is `current`, else `lang`, else `Astro.currentLocale`, else BM. Its link has `aria-current="true"`; every link carries `hreflang` and `lang`, and a tooltip naming the language in itself ("Bahasa Melayu", "English").
- The visible text is "BM" or "EN"; set `label` on a locale to change it. `hideIcon` hides the globe.
- The `<nav>` is labelled "Bahasa" in BM or "Language" in English, following `lang`.
- The component doesn't import `astro:i18n` itself, because that module fails in projects without i18n routing.
- There is no React version; in React, render links to each language yourself.
