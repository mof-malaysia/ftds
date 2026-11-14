import { cva } from "class-variance-authority";

/**
 * Classes for a key cap (Kbd), shared by the React and Astro components so
 * both stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/kbd.variants.ts.
 */
export const kbd_cva = cva(
  [
    "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-b-2 px-1",
    // Label Compact: the Floor Rule's 13px minimum
    "font-body text-label-compact leading-none font-medium",
  ],
  {
    variants: {
      inverse: {
        true: "text-txt-white border-current/30 bg-current/10",
        false: "border-otl-gray-300 bg-bg-white text-txt-black-700",
      },
    },
    defaultVariants: { inverse: false },
  },
);
