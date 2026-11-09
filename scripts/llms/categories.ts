/** Index sections, in order. Blocks and icons are grouped automatically. */
export const CATEGORIES = [
  "Actions",
  "Forms and inputs",
  "Data display",
  "Feedback and status",
  "Overlays",
  "Navigation",
  "Layout",
  "Official site elements",
  "Marketing",
  "Utilities",
] as const;
export type Category = (typeof CATEGORIES)[number];
