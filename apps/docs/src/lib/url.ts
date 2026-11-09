import type { Locale } from "../content.config";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** A site path with the base path and, for Malay, the `/ms` prefix. */
export function href(path: string, locale: Locale = "en"): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${base}${prefix}${path}`;
}

/** Point links at the Markdown catalogue back at this site's pages. */
export function localiseLinks(html: string): string {
  return html.replace(
    /https:\/\/mof-malaysia\.github\.io\/ftds\/(components|guides)\/([\w-]+)\.md/g,
    (_, kind: string, name: string) =>
      href(`/${kind === "guides" ? "start" : "components"}/${name}`),
  );
}
