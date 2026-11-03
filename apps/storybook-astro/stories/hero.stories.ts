import Hero from "@/components/blocks/hero.astro";
import { logo, placeholder } from "./_logo";

const base = {
  title: "Bayar bil kerajaan di satu tempat",
  description:
    "Jelaskan yuran, saman dan taksiran daripada lebih 30 agensi dengan satu MyDigital ID.",
  primaryAction: { label: "Mula membayar", href: "#pay" },
};

export default {
  title: "Marketing/Hero",
  component: Hero,
};

export const Default = {
  args: {
    ...base,
    eyebrow: "Baharu",
    secondaryAction: { label: "Cara ia berfungsi", href: "#how" },
    footnote: "Mengambil masa kira-kira tiga minit.",
  },
};
export const PrimaryActionOnly = { args: base };
export const WithMedia = {
  args: {
    ...base,
    eyebrow: "Baharu",
    secondaryAction: { label: "Cara ia berfungsi", href: "#how" },
    slots: {
      media: `<img src="${logo("MyBayar")}" width="480" height="144" alt="" class="w-full rounded-lg" />`,
    },
  },
};
const photo = `<img src="${placeholder("Foto", 1600, 900)}" width="1600" height="900" alt="" />`;
export const Centered = {
  args: {
    ...base,
    align: "center",
    tone: "well",
    secondaryAction: { label: "Cara ia berfungsi", href: "#how" },
  },
};
export const SplitMediaLeftPrimaryWash = {
  args: {
    ...base,
    tone: "primary",
    mediaPosition: "left",
    slots: {
      media: `<img src="${placeholder("Ilustrasi", 800, 600)}" width="800" height="600" alt="" class="w-full" />`,
    },
  },
};
export const ImageWithPanel = {
  args: {
    ...base,
    layout: "image",
    eyebrow: "Kempen",
    secondaryAction: { label: "Siapa yang layak", href: "#who" },
    slots: { media: photo },
  },
};
export const ImageWithPrimaryPanel = {
  args: { ...base, layout: "image", tone: "primary", slots: { media: photo } },
};
