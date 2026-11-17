---
title: Button (Astro)
description: Triggers an action or, with href, links to the next step. One primary (blue) button per page; tonal secondary, ghost and danger variants for everything else.
category: Actions
---

## When to use

- Use `Button` for calls to action ("Start now", "Download the guide") and for actions on the page (submit a form, open a dialog). With `href` it renders an `<a>` styled as a button, so it navigates like a link.
- Use `Link` for links inside text and in lists of links.

## Variants

The same variants as the React `Button`, from the shared `button_cva`:

| `variant`                | Looks like                         | Use for                                          |
| ------------------------ | ---------------------------------- | ------------------------------------------------ |
| `primary-fill` (default) | FTDS Blue fill, white text         | The one primary action on the page               |
| `default-outline`        | Tonal grey (Well) fill, no outline | Secondary actions: Back, Read more               |
| `default-ghost`          | Transparent, grey text             | Tertiary actions, toolbars, icon buttons         |
| `primary-outline`        | Blue wash fill, blue text          | A secondary action that must stand out (rare)    |
| `primary-ghost`          | Transparent, blue text             | Low-emphasis actions styled like a link          |
| `danger-fill`            | Red fill, white text               | Only the final confirmation of a destructive act |
| `danger-outline`         | Red wash fill, red text            | Starting a destructive flow                      |
| `danger-ghost`           | Transparent, red text              | Destructive row actions                          |

`size` is `small` (default), `medium` or `large`; heights follow the density, so don't set heights yourself.

## Usage

```astro
---
import Button from "@/components/ui/button.astro";
import ArrowForward from "@/components/ui/icons/arrow-forward.astro";
---

<div class="flex flex-wrap gap-3">
  <Button href="/apply" size="large">
    Start now
    <ArrowForward aria-hidden="true" />
  </Button>
  <Button href="/guidance" variant="default-outline" size="large">
    Read the guidance
  </Button>
</div>
```

A submit button in a form, and an icon-only button (it needs `iconOnly` and an `aria-label`):

```astro
---
import Button from "@/components/ui/button.astro";
import Search from "@/components/ui/icons/search.astro";
---

<form action="/search" class="flex items-center gap-2">
  <input name="q" aria-label="Search" />
  <Button type="submit" variant="default-ghost" iconOnly aria-label="Search">
    <Search aria-hidden="true" />
  </Button>
</form>
```

## Notes

- Without `href` it renders `<button type="button">`; pass `type="submit"` for a form's submit button.
- Put icons straight in the slot, before or after the text: every `<svg>` in the button is sized to it, as `ButtonIcon` does in React. There is no `ButtonIcon` or `ButtonCounter` part in Astro.
- Pass classes with `class`, and use them for layout (`w-full sm:w-auto`), not to recolour the button.
- Don't fill more than one button per page in blue.
