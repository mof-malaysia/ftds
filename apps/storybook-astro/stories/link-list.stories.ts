import LinkList from "@/components/blocks/link-list.astro";

const links = [
  {
    label: "Semak status permohonan",
    href: "#semak",
    description: "Dengan nombor rujukan yang dihantar melalui e-mel.",
  },
  {
    label: "Kemas kini maklumat akaun bank",
    href: "#bank",
    description: "Bayaran dimasukkan ke akaun ini.",
  },
  { label: "Soalan lazim bantuan tunai", href: "#soalan" },
  {
    label: "Portal Rasmi Kerajaan Malaysia",
    href: "https://www.malaysia.gov.my",
    description: "Perkhidmatan lain kerajaan di satu tempat.",
    external: true,
  },
];

export default {
  title: "Marketing/Link List",
  component: LinkList,
};

export const Default = { args: { title: "Pautan berkaitan", links } };
export const CardsWell = {
  args: {
    title: "Perkhidmatan lain",
    description: "Urusan yang sering dibuat bersama permohonan ini.",
    links,
    layout: "cards",
    tone: "well",
  },
};
export const ArticleWidthNoTitle = { args: { links, width: "article" } };
