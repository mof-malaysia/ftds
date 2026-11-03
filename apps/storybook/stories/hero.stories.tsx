import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Hero } from "@mof-malaysia/ftds-react/hero";

/**
 * ### Overview
 * The opening section of an agency or landing page: optional eyebrow tag, the
 * page's single h1, supporting text, a primary and a secondary action, and
 * optional media. Layouts: `stacked`, `split` (media beside the text) and
 * `image` (media behind a solid text panel). Tones: Paper, Well and the
 * primary wash. No gradients.
 *
 * ### Usage
 * ```tsx
 * <Hero
 *   eyebrow="New service"
 *   title="Pay your government bills in one place"
 *   description="Settle fees, fines and assessments from 30 agencies."
 *   primaryAction={{ label: "Start a payment", href: "/pay" }}
 *   secondaryAction={{ label: "How it works", href: "#how" }}
 *   media={<img src="/hero.svg" alt="" />}
 * />
 * ```
 */
const meta: Meta<typeof Hero> = {
  title: "Marketing/Blocks/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
};

export default meta;

const media = (
  <img
    src="https://d2391uizq0pg2.cloudfront.net/common/preview-2.svg"
    alt=""
    className="h-auto w-full"
  />
);

const WithMedia = () => (
  <Hero
    eyebrow="New service"
    title="Pay your government bills in one place"
    description="Settle fees, fines and assessments from more than 30 agencies with one MyDigital ID. Every payment gets an official receipt."
    primaryAction={{ label: "Start a payment", href: "#" }}
    secondaryAction={{ label: "How it works", href: "#" }}
    footnote="Takes about three minutes. Keep your bill number handy."
    media={media}
  />
);
export const Default = createRender(WithMedia);

const TextOnly = () => (
  <Hero
    title="Bajet 2027: Membina Malaysia MADANI"
    description="Baca ringkasan langkah-langkah utama, insentif untuk rakyat dan perniagaan, serta dokumen penuh bajet."
    primaryAction={{ label: "Baca ringkasan", href: "#" }}
    secondaryAction={{ label: "Muat turun dokumen", href: "#" }}
  />
);
export const TextOnlyBahasaMelayu = createRender(TextOnly);

export const Centered = createRender(() => (
  <Hero
    align="center"
    tone="well"
    title="Bajet 2027: Membina Malaysia MADANI"
    description="Baca ringkasan langkah-langkah utama, insentif untuk rakyat dan perniagaan, serta dokumen penuh bajet."
    primaryAction={{ label: "Baca ringkasan", href: "#" }}
    secondaryAction={{ label: "Muat turun dokumen", href: "#" }}
  />
));

export const MediaLeftPrimaryWash = createRender(() => (
  <Hero
    tone="primary"
    mediaPosition="left"
    title="Pay your government bills in one place"
    description="Settle fees, fines and assessments from more than 30 agencies with one MyDigital ID."
    primaryAction={{ label: "Start a payment", href: "#" }}
    media={media}
  />
));

export const ImageWithPanel = createRender(() => (
  <Hero
    layout="image"
    eyebrow="Kempen"
    title="Daftar sebelum 31 Disember"
    description="Pendaftaran mengambil masa lima minit. Sediakan MyKad anda."
    primaryAction={{ label: "Daftar sekarang", href: "#" }}
    secondaryAction={{ label: "Siapa yang layak", href: "#" }}
    media={media}
  />
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <WithMedia />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <WithMedia />
    </div>
  ),
  "dark",
);
