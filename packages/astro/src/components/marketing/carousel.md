---
title: Carousel (Astro)
description: A horizontal row of slides on CSS scroll-snap that people swipe or scroll. A small script adds previous and next buttons, dots and arrow keys; no autoplay unless you turn it on.
category: Marketing
---

## When to use

- Use `Carousel` for a short row of items of equal weight on a landing page, such as latest updates or featured services, where showing a few and scrolling to the rest saves space.
- Use the `FeatureGrid` block when every item matters: a grid shows them all at once.
- Use `Testimonial` for quotes, `LogoCloud` for agency logos, and `Tabs` to switch between views of one thing.
- Don't put the only route to a task, or anything a citizen must read, in a slide they may never reach.

## Usage

Each direct child of the default slot is one slide. Name the carousel with `aria-label` or `aria-labelledby`, and set `perView` to show more than one slide at a time:

```astro
---
import Carousel from "@/components/ui/carousel.astro";
import Link from "@/components/ui/link.astro";
import Section from "@/components/ui/section.astro";

const updates = [
  {
    title: "Belanjawan 2027: apa yang berubah untuk isi rumah",
    text: "Ringkasan pelepasan cukai dan bantuan tunai yang baharu.",
    href: "/belanjawan-2027",
  },
  {
    title: "e-Invois untuk perniagaan kecil",
    text: "Siapa yang perlu mengeluarkan e-invois mulai Julai 2027, dan cara bermula.",
    href: "/e-invois",
  },
  {
    title: "Penyelenggaraan berjadual pada 2 November",
    text: "Pembayaran tidak tersedia dari 1 pagi hingga 4 pagi.",
    href: "/notis/penyelenggaraan",
  },
];
---

<Section title="Berita terkini" titleId="berita-terkini">
  <Carousel aria-labelledby="berita-terkini" perView="third">
    {
      updates.map((update) => (
        <article class="bg-bg-white p-surface flex h-full flex-col gap-3 rounded-lg">
          <h3 class="text-title text-txt-black-900 font-semibold">
            <Link href={update.href} underline="hover">{update.title}</Link>
          </h3>
          <p class="text-content text-txt-black-700">{update.text}</p>
        </article>
      ))
    }
  </Carousel>
</Section>
```

## Notes

- React's `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselDots` and `CarouselPlayToggle` parts are built in here: slides are the slot's children, and the controls sit in one row under the track. `indicators={false}` hides the dots. There is no `onIndexChange` or `useCarousel`.
- `perView="half"` and `"third"` show part of the next slide on small screens, then 2 or 3 slides from `md` / `lg`. Set it here rather than a basis on each slide.
- Without JavaScript it is a row people swipe or scroll, with every slide in the page, and the controls stay hidden. The script adds the buttons (disabled at the ends), the dots, "2 daripada 5" names on the slides, and the left and right arrow keys while focus is inside (except in form fields).
- `autoplay` (milliseconds between slides) also shows a pause / play button. Autoplay pauses while the pointer is over the carousel or focus is inside, stops for good once the visitor navigates, and never starts under `prefers-reduced-motion`. Avoid it unless there is a clear reason.
- There is no `labels` prop: the built-in labels are "Slaid sebelumnya", "Slaid seterusnya", "Jeda slaid" and so on in BM (the default) or "Previous slide", "Next slide", "Pause slides" in English, following `lang`.
- Put each slide's content on a Sheet or Well surface without borders, at full height (`h-full`), so the slides line up.
