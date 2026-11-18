import type { Framework } from "../../../../scripts/llms/content";
import type { ModuleExports } from "./check";

/** React items render in render_screen; Astro items are for Astro sites only. */
export type { Framework };

/** What scripts/catalogue.ts writes to src/generated/catalogue.json. */
export interface Catalogue {
  /** FTDS release the catalogue was built from, or "main". */
  version: string;
  docsUrl: string;
  /** llms.txt up to the guides: what FTDS is and the rules that matter most. */
  intro: string;
  /** React sections first, then Astro ones, as in llms.txt. */
  sections: {
    category: string;
    items: { name: string; description: string; framework: Framework }[];
  }[];
  /** Item name → its llms page (props, examples, rules), with the same item in the other stack if there is one. */
  pages: Record<
    string,
    { framework: Framework; counterpart?: string; body: string }
  >;
  guides: { slug: string; title: string; body: string }[];
  icons: { export: string; import: string }[];
  modules: ModuleExports;
  /** React import path → registry item name, e.g. `@/components/ui/icons/check` → `icon-check`. */
  items: Record<string, string>;
}
