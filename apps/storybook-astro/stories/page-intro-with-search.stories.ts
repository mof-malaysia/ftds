import PageIntroWithSearch from "./page-intro-with-search.astro";

// Same title as page-intro.stories.ts: Storybook lists this story under Marketing/Page Intro
export default {
  title: "Marketing/Page Intro",
  component: PageIntroWithSearch,
};

export const WithSearch = {
  args: {
    tone: "primary",
    breadcrumb: [{ label: "Utama", href: "#utama" }, { label: "Berita" }],
    title: "Berita",
    description: "Kenyataan media, ucapan dan berita terkini kementerian.",
    search: {
      action: "#carian",
      size: "large",
      labels: { label: "Cari dalam berita" },
      params: { koleksi: "Berita" },
      placeholder: "Taip untuk mencari",
    },
  },
};
