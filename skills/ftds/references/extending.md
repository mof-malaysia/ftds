# Extending FTDS in a project

Read this when no block or component does the job and you are about to write a component of your own.

## Where code goes

Put project components in a folder of their own, such as `components/<feature>/`, not in `components/ui/` or `components/blocks/`. Then a later `shadcn add --overwrite` never replaces them, and a reader can tell FTDS code from project code.

When you edit an installed block, add a comment at its top that says what changed and why, such as `// Changed from FTDS: adds a second reference number for joint applications.` The next upgrade can then carry the change over.

## Build from FTDS parts

A project component is a composition, not a new look:

- Use FTDS components for every control, tag, callout, table and overlay inside it. Never hand-build a `<button>`, `<input>` or `<table>`.
- Style the frame by the [styling guide](https://mof-malaysia.github.io/ftds/guides/styling.md): surface, text and status tokens (the project's own colour tokens first, where it has them), the density spacing (`p-surface`, `gap-stack-*`), the type utilities, and the control utilities for anything that sits beside FTDS controls. No borders except row hairlines, and no shadows.
- Need a look FTDS already has, such as a button style? Import the shared classes from the installed `*.variants.ts` file (for example `button_cva` from `@/components/ui/button.variants`) instead of copying class strings.
- Give it an API like FTDS's, by the [conventions guide](https://mof-malaysia.github.io/ftds/guides/conventions.md): `className` merged with `cn`, Base UI's names for state, and a `labels` prop for built-in text. In Astro, take `class` and `lang` props instead.

```tsx
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ftds/utils";

export function PaymentDue({
  amount,
  dueDate,
  onPay,
  className,
}: {
  amount: string;
  dueDate: string;
  onPay: () => void;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "gap-stack-sm bg-bg-white p-surface flex flex-col rounded-lg",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-title text-txt-black-900 font-semibold">
          Tax payable
        </h2>
        <Tag variant="warning">Due {dueDate}</Tag>
      </div>
      <p className="text-headline text-txt-black-900 font-semibold tabular-nums">
        RM {amount}
      </p>
      <Button className="w-full sm:w-fit" onClick={onPay}>
        Pay now
      </Button>
    </section>
  );
}
```

## Write it down

Give each project component a short doc beside it, `<name>.md`, in the same shape as FTDS pages: frontmatter `title` and `description`, then **When to use**, **Usage** and **Notes**. People and agents working on the project later read it the same way they read FTDS.
