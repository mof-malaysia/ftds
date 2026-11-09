import { loadStories } from "./stories";

/** Whole-page references: Astro templates and React example screens. */
export const astroTemplates = import.meta.glob<{ default: any }>(
  "../../../../packages/astro/src/templates/*.astro",
);

const astroNames: Record<string, { title: string; about: string }> = {
  "agency-home": {
    title: "Agency homepage",
    about: "Gets people to the services they came for, then shows what's new.",
  },
  "service-landing": {
    title: "Service landing",
    about: "Explains one service: who can apply, the steps, what it costs.",
  },
  campaign: { title: "Campaign", about: "A single message with one action." },
  "news-listing": {
    title: "News listing",
    about: "Updates in date order, with paging.",
  },
  "news-article": {
    title: "News article",
    about: "A long-form story with its media and date.",
  },
  event: { title: "Event", about: "Facts, registration and programme." },
  about: {
    title: "About and leadership",
    about: "What the agency does and who runs it.",
  },
  contact: { title: "Contact", about: "Channels and offices." },
  publications: {
    title: "Publications library",
    about: "Files with their type and size.",
  },
  "not-found": {
    title: "Page not found",
    about: "A 404 that helps people recover.",
  },
  maintenance: {
    title: "Maintenance",
    about: "Says what's down and when it returns.",
  },
};

export function astroTemplateList() {
  return Object.keys(astroTemplates)
    .map((path) =>
      path
        .split("/")
        .pop()!
        .replace(/\.astro$/, ""),
    )
    .filter((name) => astroNames[name])
    .map((name) => ({ name, ...astroNames[name], id: `astro-${name}` }));
}

const EXAMPLE_FILES = [
  ["app-citizen-examples", "Citizen"],
  ["app-officer-examples", "Officer"],
  ["app-account-examples", "Account"],
  ["app-access-examples", "Sign-in"],
] as const;

export async function reactScreens() {
  const { react } = await loadStories();
  return EXAMPLE_FILES.flatMap(([key, group]) => {
    const file = react.get(key);
    if (!file) return [];
    return file.stories
      .filter((s) => !/mobile/i.test(s.id))
      .map((s) => ({
        id: `react-${key}--${s.id}`,
        title: `${group}: ${s.title.toLowerCase()}`,
        file: file.file,
        story: s.id,
      }));
  });
}

/** Shell stories previewed by the Page Layouts guide, not listed as templates. */
const SHELL_FILES = [
  ["app-shell", "react-app-shell", "Officer tool"],
  ["split-pane", "react-split-pane", "List and detail"],
] as const;

export async function shellScreens() {
  const { react } = await loadStories();
  return SHELL_FILES.flatMap(([key, id, title]) => {
    const file = react.get(key);
    return file?.stories[0]
      ? [{ id, title, file: file.file, story: file.stories[0].id }]
      : [];
  });
}
