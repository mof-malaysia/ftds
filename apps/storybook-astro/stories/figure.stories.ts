import Figure from "@/components/blocks/figure.astro";
import { placeholder } from "./_logo";

const img = (width: number, height: number) => ({
  default: `<img src="${placeholder("Foto", width, height)}" width="${width}" height="${height}" alt="Bangunan pejabat lima tingkat berdinding kaca" />`,
});

export default {
  title: "Marketing/Figure",
  component: Figure,
};

export const Default = {
  args: {
    caption: "Pejabat baharu di Presint 2, dibuka Januari 2027.",
    credit: "Unit Komunikasi Korporat",
    slots: img(1600, 900),
  },
};
export const WideWell = {
  args: {
    width: "wide",
    tone: "well",
    caption: "Kaunter perkhidmatan di tingkat bawah.",
    slots: img(1600, 900),
  },
};
export const FullWidth = {
  args: { width: "full", credit: "Bernama", slots: img(2400, 900) },
};
export const NoCaption = { args: { slots: img(1600, 900) } };
