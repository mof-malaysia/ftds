import SiteSearch from "@/components/ui/site-search.astro";

export default {
  title: "Marketing/Site Search",
  component: SiteSearch,
  parameters: { layout: "padded" },
};

export const Default = {
  args: { action: "#carian", placeholder: "Contoh: cukai jalan" },
};
export const Large = {
  args: {
    action: "#carian",
    size: "large",
    showLabel: true,
    shortcut: true,
    placeholder: "Contoh: pelepasan cukai, status bayaran balik",
  },
};
export const InOneCollection = {
  args: {
    action: "#carian",
    labels: { label: "Cari dalam berita" },
    params: { koleksi: "Berita" },
    defaultValue: "belanjawan",
  },
};
