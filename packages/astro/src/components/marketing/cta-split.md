---
title: CTA Split (Astro)
description: A mid-page call to action with a picture: title, short case, up to four reasons as a checklist and the actions on one side, an image on the other.
---

## When to use

- Use `CtaSplit` in the middle of a campaign page, where the closing `CtaBand` would come too late, and a picture helps make the case.
- Use `CtaBand` for the closing call to action, and `CtaCards` when people choose between ways to act.

## Usage

```astro
---
import CtaSplit from "@/components/blocks/cta-split.astro";
---

<CtaSplit
  title="Satu akaun untuk semua invois anda"
  description="Keluarkan, hantar dan simpan invois di satu tempat."
  points={["Percuma untuk perniagaan kecil", "Log masuk dengan MyDigital ID", "Invois disahkan dalam masa nyata"]}
  primaryAction={{ label: "Daftar sekarang", href: "/daftar" }}
  secondaryAction={{ label: "Tonton demo", href: "/demo" }}
>
  <img slot="media" src="/images/aplikasi.png" width="800" height="600" alt="" />
</CtaSplit>
```

## Notes

- `points` are up to four short reasons, each with a tick. The tick is decorative; each point must make sense as text.
- The panel is Sheet, so only the primary button is filled blue. `tone` sets the band around it: `paper` (default) or `well`.
- The `media` slot takes the image, decorative unless you give it alt text; `mediaPosition` puts it on the `left` or `right` (default) on desktop. The `actions` slot replaces the two action links.
- Templates in `packages/astro/src/templates` that use it: `campaign.astro`.
