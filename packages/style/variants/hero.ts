import { cva } from "class-variance-authority";

/**
 * Classes for hero, shared by the React and Astro components so both stacks
 * render the same. Edit here, not in the component. The registry installs
 * this file as components/ui/hero.variants.ts. The band itself is section's
 * `band_cva` (Paper, Well, or the primary wash).
 *
 * Layouts: `stacked` (text only), `split` (text beside the media on desktop)
 * and `image` (the media fills the band and the text sits on a solid panel
 * over it, so its contrast never depends on the picture).
 */

type Layout = "stacked" | "split" | "image";
type Align = "start" | "center";
type Tone = "paper" | "well" | "primary";

/**
 * The layout and alignment a hero renders with. Without media it is always
 * stacked, since there is nothing to put beside or behind the text; only a
 * stacked hero centres.
 */
export const resolve_layout = (
  hasMedia: boolean,
  layout: Layout | undefined,
  align: Align,
): { layout: Layout; align: Align } => {
  const resolved = hasMedia ? (layout ?? "split") : "stacked";
  return { layout: resolved, align: resolved === "stacked" ? align : "start" };
};

/**
 * Goes on the band beside section's `band_cva`: the image layout's media is
 * positioned against it, behind the panel.
 */
export const band_class = "relative isolate";

/** The centred column and its grid. */
export const container_cva = cva(
  "mx-auto grid w-full max-w-[1280px] items-center px-4 md:px-6 lg:py-24",
  {
    variants: {
      layout: {
        stacked: "gap-10 py-12 md:py-16",
        split: "gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-12",
        image: "lg:min-h-[560px]",
      },
    },
  },
);

/** The text column: eyebrow, h1, description, actions, footnote. */
export const content_cva = cva("flex flex-col items-start gap-6", {
  variants: {
    layout: {
      stacked: "max-w-[760px]",
      split: "lg:col-span-6",
      // A solid panel: flush with the band on mobile, a card over the media from lg
      image:
        "-mx-4 p-6 md:-mx-6 md:p-10 lg:mx-0 lg:max-w-[640px] lg:rounded-lg lg:p-12",
    },
    align: {
      start: "",
      center: "mx-auto items-center text-center",
    },
    // Only a split hero has media in the flow from lg
    mediaPosition: {
      left: "lg:order-2",
      right: "",
    },
    tone: {
      paper: "",
      well: "",
      primary: "",
    },
  },
  compoundVariants: [
    { layout: "image", tone: ["paper", "well"], class: "bg-bg-white" },
    { layout: "image", tone: "primary", class: "bg-bg-primary-50" },
  ],
});

export const description_cva = cva(
  "text-txt-black-700 text-body-lg md:text-body-xl max-w-[60ch]",
  {
    variants: {
      align: {
        start: "",
        center: "mx-auto",
      },
    },
  },
);

/** The actions row; centred with the text. */
export const actions_cva = cva("flex flex-wrap items-center gap-3", {
  variants: {
    align: {
      start: "",
      center: "justify-center",
    },
  },
});

/**
 * Where the media goes. `image` covers the band from lg, and is a 16:9
 * picture above the text on mobile. Stacked never renders media.
 */
export const media_cva = cva("overflow-hidden", {
  variants: {
    layout: {
      stacked: "",
      split: "rounded-lg lg:col-span-6",
      image: [
        "order-first -mx-4 aspect-video md:-mx-6 lg:absolute lg:inset-0 lg:-z-10 lg:mx-0 lg:aspect-auto",
        "[&>picture]:block [&>picture]:h-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
      ],
    },
  },
});

/**
 * The secondary action's Button, by the surface it sits on, as on CtaBand:
 * the Well-grey `default-outline` would vanish on a Well band, and a ghost's
 * hover must differ from the band (wash on Well, Raised on the wash). The
 * image layout's panel is Sheet, or the wash.
 */
export const secondary_action = (tone: Tone, layout: Layout) => {
  const surface = layout === "image" && tone !== "primary" ? "paper" : tone;
  return (
    {
      paper: { variant: "default-outline", class: undefined },
      well: { variant: "primary-ghost", class: undefined },
      primary: { variant: "default-ghost", class: "hover:bg-bg-raised" },
    } as const
  )[surface];
};
