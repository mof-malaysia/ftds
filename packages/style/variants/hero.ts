import { cva } from "class-variance-authority";

/**
 * Classes for hero, shared by the React and Astro components so both stacks
 * render the same. Edit here, not in the component. The registry installs
 * this file as components/ui/hero.variants.ts.
 *
 * Layouts: `stacked` (text only), `split` (text beside the media on desktop)
 * and `image` (the media fills the band and the text sits on a solid panel
 * over it, so its contrast never depends on the picture).
 */

/**
 * The band. `primary` is the primary wash, as on CtaBand: a solid primary band
 * would break the One Blue Rule (DESIGN.md), and the wash keeps Ink text and
 * the usual buttons.
 */
export const band_cva = cva("font-body w-full", {
  variants: {
    tone: {
      paper: "bg-bg-gray-50",
      well: "bg-bg-washed",
      primary: "bg-bg-primary-50",
    },
    layout: {
      stacked: "",
      split: "",
      // The media sits behind the panel from lg; the band shows only on mobile
      image: "relative isolate",
    },
  },
  defaultVariants: { tone: "paper", layout: "stacked" },
});

/** The centred column and its grid. */
export const container_cva = cva(
  "mx-auto grid w-full max-w-[1280px] px-4 md:px-6",
  {
    variants: {
      layout: {
        stacked: "gap-10 py-12 md:py-16 lg:py-24",
        split:
          "items-center gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12 lg:py-24",
        image: "lg:min-h-[560px] lg:items-center lg:py-24",
      },
    },
    defaultVariants: { layout: "stacked" },
  },
);

/** The text column: eyebrow, h1, description, actions, footnote. */
export const content_cva = cva("flex flex-col gap-6", {
  variants: {
    layout: {
      stacked: "max-w-[760px]",
      split: "lg:col-span-6",
      // A solid panel: flush with the band on mobile, a card over the media from lg
      image:
        "-mx-4 p-6 md:-mx-6 md:p-10 lg:mx-0 lg:max-w-[640px] lg:rounded-lg lg:p-12",
    },
    align: {
      start: "items-start",
      center: "items-center text-center",
    },
    mediaPosition: {
      left: "",
      right: "",
    },
    tone: {
      paper: "",
      well: "",
      primary: "",
    },
  },
  compoundVariants: [
    { layout: "stacked", align: "center", class: "mx-auto" },
    { layout: "split", mediaPosition: "left", class: "lg:order-2" },
    { layout: "image", tone: ["paper", "well"], class: "bg-bg-white" },
    { layout: "image", tone: "primary", class: "bg-bg-primary-50" },
  ],
  defaultVariants: {
    layout: "stacked",
    align: "start",
    mediaPosition: "right",
    tone: "paper",
  },
});

/** Where the media goes. `image` covers the band from lg, and is a 16:9 picture above the text on mobile. */
export const media_cva = cva("overflow-hidden", {
  variants: {
    layout: {
      stacked: "hidden",
      split: "rounded-lg lg:col-span-6",
      image: [
        "order-first -mx-4 aspect-video md:-mx-6 lg:absolute lg:inset-0 lg:-z-10 lg:mx-0 lg:aspect-auto",
        "[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>picture>img]:h-full [&>picture>img]:w-full [&>picture>img]:object-cover",
      ],
    },
  },
  defaultVariants: { layout: "stacked" },
});

/** The actions row; centred with the text. */
export const actions_cva = cva("flex flex-wrap items-center gap-3", {
  variants: {
    align: {
      start: "",
      center: "justify-center",
    },
  },
  defaultVariants: { align: "start" },
});

/**
 * Extra classes for the secondary action (a `default-outline` Button). That
 * button is Well grey, so on a Well band it would vanish; there it is Sheet.
 */
export const secondary_action_cva = cva("", {
  variants: {
    tone: { paper: "", well: "", primary: "" },
    layout: { stacked: "", split: "", image: "" },
  },
  compoundVariants: [
    {
      tone: "well",
      layout: ["stacked", "split"],
      class: "bg-bg-white hover:bg-bg-white-hover",
    },
  ],
});
