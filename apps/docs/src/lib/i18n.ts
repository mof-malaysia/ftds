import type { Locale } from "../content.config";

/**
 * Interface words for the docs frame. English ships first; set BM_ENABLED once
 * the page content is translated to turn on the language switch and /ms routes.
 */
export const BM_ENABLED = false;

const strings = {
  search: { en: "Search", ms: "Cari" },
  searchPlaceholder: {
    en: "Search components, guides, tokens",
    ms: "Cari komponen, panduan, token",
  },
  noResults: {
    en: "Nothing matches that. Try a component name.",
    ms: "Tiada padanan. Cuba nama komponen.",
  },
  menu: { en: "Open menu", ms: "Buka menu" },
  closeMenu: { en: "Close menu", ms: "Tutup menu" },
  skip: { en: "Skip to content", ms: "Langkau ke kandungan" },
  start: { en: "Start", ms: "Mula" },
  foundations: { en: "Foundations", ms: "Asas" },
  components: { en: "Components", ms: "Komponen" },
  templates: { en: "Templates", ms: "Templat" },
  agents: { en: "AI assistants", ms: "Pembantu AI" },
  onThisPage: { en: "On this page", ms: "Di halaman ini" },
  previous: { en: "Previous", ms: "Sebelum" },
  next: { en: "Next", ms: "Seterusnya" },
  stack: { en: "Stack", ms: "Tindanan" },
  density: { en: "Density", ms: "Ketumpatan" },
  theme: { en: "Theme", ms: "Tema" },
  citizen: { en: "Citizen", ms: "Rakyat" },
  officer: { en: "Officer", ms: "Pegawai" },
  light: { en: "Light", ms: "Cerah" },
  dark: { en: "Dark", ms: "Gelap" },
  code: { en: "Code", ms: "Kod" },
  install: { en: "Install", ms: "Pasang" },
  examples: { en: "Examples", ms: "Contoh" },
  moreExamples: { en: "More examples", ms: "Lagi contoh" },
  reactOnly: { en: "React only", ms: "React sahaja" },
  astroOnly: { en: "Astro only", ms: "Astro sahaja" },
  storybook: { en: "Open in Storybook", ms: "Buka dalam Storybook" },
  markdown: { en: "View as Markdown", ms: "Lihat sebagai Markdown" },
  source: { en: "View source", ms: "Lihat sumber" },
} as const;

export type StringKey = keyof typeof strings;

export const t = (key: StringKey, locale: Locale = "en") =>
  strings[key][locale];
