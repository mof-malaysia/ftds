/** Figures for the Styling guide. Everything is drawn with the token it names. */
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Fig, Live } from "./kit";

/** Plate: the three surfaces and a floating layer. */
export function Hero() {
  return (
    <div className="sheet surfaces" data-density="comfortable">
      <div className="bg-bg-gray-50 surf surf--paper">
        <p className="surf-name">Paper</p>
        <div className="bg-bg-white surf surf--sheet">
          <p className="surf-name">Sheet</p>
          <div className="bg-bg-washed surf surf--well">
            <p className="surf-name">Well</p>
          </div>
        </div>
        <div className="bg-bg-dialog shadow-context-menu surf surf--float">
          <p className="surf-name">Floating layer</p>
        </div>
      </div>
    </div>
  );
}

export function Ink() {
  const rows = [
    [
      "text-txt-black-900",
      "Ink",
      "Headings and body text",
      "Application received",
    ],
    [
      "text-txt-black-700",
      "Ink Secondary",
      "Supporting text, hints, table headers",
      "We reply in five days",
    ],
    [
      "text-txt-black-500",
      "Ink Tertiary",
      "Placeholders and metadata only",
      "Updated 2 November",
    ],
    [
      "text-txt-primary",
      "Primary",
      "Links and the selected item",
      "View application",
    ],
    [
      "text-txt-danger",
      "Status: error",
      "Errors and overdue amounts",
      "Payment overdue",
    ],
    [
      "text-txt-success",
      "Status: success",
      "Completed and approved",
      "Payment received",
    ],
    [
      "text-txt-warning",
      "Status: warning",
      "Deadlines and missing details",
      "Due in three days",
    ],
  ];
  return (
    <Fig>
      <ul className="token-rows">
        {rows.map(([cls, name, use, text]) => (
          <li key={cls}>
            <span className={`text-lg font-medium ${cls}`}>{text}</span>
            <span className="token-name">
              <b>{name}</b>
              {use}
            </span>
            <code>{cls}</code>
          </li>
        ))}
      </ul>
    </Fig>
  );
}

export function Blue() {
  return (
    <Fig caption="Blue covers at most a tenth of a screen, and only one thing on it is filled.">
      <div className="blue-fig">
        <Live className="blue-screen">
          <p className="text-title text-txt-black-900 font-semibold">
            Pay your licence fee
          </p>
          <div className="bg-bg-washed blue-sum">
            <span className="text-txt-black-700">Total to pay</span>
            <strong className="text-txt-black-900 tabular-nums">
              RM 1,551.00
            </strong>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button>Pay now</Button>
            <Button variant="default-outline">Pay later</Button>
          </div>
        </Live>
        <div className="blue-key">
          <div
            className="blue-bar"
            role="img"
            aria-label="Neutral surfaces fill about nine tenths of the screen, blue about one tenth"
          >
            <span />
            <i />
          </div>
          <p className="blue-tags-label">Status is a wash with words</p>
          <Live className="flex flex-wrap gap-2">
            <Tag variant="success">Paid</Tag>
            <Tag variant="warning">Due soon</Tag>
            <Tag variant="danger">Overdue</Tag>
          </Live>
        </div>
      </div>
    </Fig>
  );
}

export function Scale() {
  const rows = [
    [
      "text-display",
      "32px",
      "Display",
      "A service landing title, at most one per page",
    ],
    [
      "text-headline",
      "24px",
      "Headline",
      "Section titles, high-stakes dialogs",
    ],
    ["text-title", "18px", "Title", "Card, panel and form headings"],
    [
      "text-content",
      "16px, 14px compact",
      "Content",
      "Reading text in layouts and panels",
    ],
    [
      "text-label-compact",
      "13px",
      "Compact label",
      "Table headers and captions, the smallest size",
    ],
  ];
  return (
    <Fig>
      <ul className="token-rows token-rows--scale">
        {rows.map(([cls, size, name, use]) => (
          <li key={cls}>
            <span className={`${cls} text-txt-black-900 font-semibold`}>
              {name}
            </span>
            <span className="token-name">
              <b>{size}</b>
              {use}
            </span>
            <code>{cls}</code>
          </li>
        ))}
      </ul>
    </Fig>
  );
}

function SpacePanel({
  density,
  label,
}: {
  density: "comfortable" | "compact";
  label: string;
}) {
  return (
    <div>
      <p className="fig-lang">{label}</p>
      <div
        data-density={density}
        className="bg-bg-washed p-surface gap-stack-md space-panel flex flex-col rounded-lg"
      >
        <div className="bg-bg-white space-block" />
        <div className="bg-bg-white space-block" />
        <div className="bg-bg-white space-block" />
      </div>
    </div>
  );
}

export function Space() {
  return (
    <Fig
      caption={
        <>
          <code>p-surface</code> and <code>gap-stack-md</code> change with the
          density, so one layout works for both.
        </>
      }
    >
      <div className="fig-pair">
        <SpacePanel
          density="comfortable"
          label="Comfortable: 24px padding, 16px gaps"
        />
        <SpacePanel
          density="compact"
          label="Compact: 16px padding, 12px gaps"
        />
      </div>
    </Fig>
  );
}

export function Shape() {
  return (
    <Fig
      tone="well"
      caption="Corners grow with the size of the surface. Shadows are only for things that float."
    >
      <div className="shapes">
        <div>
          <div className="shape-box bg-bg-white rounded-md" />
          <strong>8px</strong>
          <span>Controls</span>
        </div>
        <div>
          <div className="shape-box bg-bg-white rounded-lg" />
          <strong>12px</strong>
          <span>Cards, dialogs</span>
        </div>
        <div>
          <div className="shape-box bg-bg-white rounded-full" />
          <strong>Full</strong>
          <span>Tags, pills</span>
        </div>
        <div>
          <div className="shape-box bg-bg-dialog shadow-context-menu rounded-lg" />
          <strong>Float</strong>
          <span>Menus, toasts</span>
        </div>
        <div>
          <div className="shape-box bg-bg-dialog shadow-dialog rounded-lg" />
          <strong>Lift</strong>
          <span>Dialogs, sheets</span>
        </div>
      </div>
    </Fig>
  );
}

export function Custom() {
  return (
    <Fig
      tone="well"
      caption="The code below, rendered. It uses tokens only, so it follows dark mode and density."
    >
      <Live className="custom-fig">
        <section className="gap-stack-sm bg-bg-white p-surface flex flex-col rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-title text-txt-black-900 font-semibold">
              Tax payable
            </h2>
            <Tag variant="warning">Due 30 April</Tag>
          </div>
          <p className="text-content text-txt-black-700">
            Pay before the due date to avoid a late payment penalty.
          </p>
          <p className="text-headline text-txt-black-900 font-semibold tabular-nums">
            RM 1,240.00
          </p>
        </section>
      </Live>
    </Fig>
  );
}
