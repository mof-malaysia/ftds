import type { Entry } from "./catalog";
import { getCategories } from "./catalog";
import { href } from "./url";

export interface NavLink {
  title: string;
  href: string;
  id: string;
  /** Hide this link when the reader has chosen the other stack. */
  only?: "react" | "astro";
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const startLinks: NavLink[] = [
  { title: "Introduction", href: href("/start"), id: "start" },
  { title: "Choose a stack", href: href("/start/stacks"), id: "start/stacks" },
  { title: "Set up React", href: href("/start/setup"), id: "start/setup" },
  { title: "Set up Astro", href: href("/start/astro"), id: "start/astro" },
  {
    title: "Conventions",
    href: href("/start/conventions"),
    id: "start/conventions",
  },
  { title: "Styling", href: href("/start/styling"), id: "start/styling" },
  { title: "Forms", href: href("/start/forms"), id: "start/forms" },
  { title: "Layouts", href: href("/start/layouts"), id: "start/layouts" },
];

export const foundationLinks: NavLink[] = [
  {
    title: "Colour",
    href: href("/foundations/colour"),
    id: "foundations/colour",
  },
  {
    title: "Typography",
    href: href("/foundations/typography"),
    id: "foundations/typography",
  },
  {
    title: "Density",
    href: href("/foundations/density"),
    id: "foundations/density",
  },
  {
    title: "Elevation and layers",
    href: href("/foundations/elevation"),
    id: "foundations/elevation",
  },
  { title: "Icons", href: href("/foundations/icons"), id: "foundations/icons" },
];

export function entryLink(entry: Entry): NavLink {
  return {
    title: entry.title,
    href: href(`/components/${entry.name}`),
    id: `components/${entry.name}`,
    only:
      entry.react && entry.astro ? undefined : entry.react ? "react" : "astro",
  };
}

export async function getNav() {
  const categories = await getCategories();
  return {
    start: startLinks,
    foundations: foundationLinks,
    components: categories.map((c): NavGroup => ({
      title: c.name,
      links: c.entries.map(entryLink),
    })),
  };
}
