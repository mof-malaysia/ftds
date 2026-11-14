import { cva } from "class-variance-authority";

/**
 * Classes for input, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/input.variants.ts.
 */

/** The box around the field and its add-ons: it carries the border. */
export const input_box_class = [
  "border-otl-control relative rounded-md border outline-none",
  // Inside an invalid Field (DESIGN.md: error stroke turns Danger)
  "has-[input[data-invalid]]:border-bg-danger-600",
];

export const input_cva = cva(
  [
    "bg-bg-white border border-transparent outline-none box-border rounded-md",
    "placeholder:text-txt-black-500 text-txt-black-700 transition-colors w-full",
    "focus-visible:ring focus-visible:ring-fr-primary focus-visible:border-otl-primary-300",
    "disabled:bg-bg-washed disabled:cursor-not-allowed disabled:text-txt-black-disabled",
    "data-[has-prepend=true]:rounded-l-none data-[has-append=true]:rounded-r-none",
    "data-[has-left-icon=true]:pl-10 data-[has-right-icon=true]:pr-10",
  ],
  {
    variants: {
      size: {
        // Height excludes the wrapper's 1px border; follows data-density
        small: "h-[calc(var(--ctl-h-sm)-2px)] px-3 text-field-sm",
        medium: "h-[calc(var(--ctl-h-md)-2px)] px-3 text-field-md",
        large: "h-[calc(var(--ctl-h-lg)-2px)] px-3.5 text-field-lg",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

// Ink Secondary, so icons follow the theme instead of inheriting the page's text colour
export const input_icon_cva = cva(
  ["absolute top-0 bottom-0 my-auto text-txt-black-700"],
  {
    variants: {
      size: {
        small: "size-4.5",
        medium: "size-5",
        large: "size-6",
      },
      position: {
        left: "left-3",
        right: "right-3",
      },
    },
    defaultVariants: {
      position: "left",
    },
  },
);
