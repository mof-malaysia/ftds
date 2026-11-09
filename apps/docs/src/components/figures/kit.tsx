/**
 * The pieces every guide figure is made of. Figures render on the server with
 * real FTDS components and no hydration, so live pieces sit inside `Live`,
 * which makes them inert. References stay outside it, and stay links.
 */
import type { ReactNode } from "react";
import { href } from "~/lib/url";

export function R({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a className="ref" href={href(`/components/${to}`)}>
      {children}
    </a>
  );
}

export function Fig({
  tone = "sheet",
  caption,
  children,
}: {
  tone?: "sheet" | "well" | "plate";
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className={`fig fig--${tone}`}>
      <div className="fig-body">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function Live({
  density = "comfortable",
  className = "",
  children,
}: {
  density?: "comfortable" | "compact";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div inert data-density={density} className={`fig-live ${className}`}>
      {children}
    </div>
  );
}

/** One row of an annotated specimen: a mark, a name and what it does. */
export function Note({
  row,
  name,
  children,
}: {
  row: number;
  name: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="anat-note" style={{ gridRow: row }}>
      <span className="anat-lead" aria-hidden="true" />
      <div>
        {name}
        {children && <p>{children}</p>}
      </div>
    </div>
  );
}

function Mark({ good }: { good: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={good ? "m4.5 10.5 3.5 3.5 7.5-8" : "m5.5 5.5 9 9m0-9-9 9"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Side({
  good,
  label,
  children,
}: {
  good: boolean;
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fig-side">
      <div className="fig-side-live">{children}</div>
      <p
        className={`fig-verdict ${good ? "fig-verdict--good" : "fig-verdict--bad"}`}
      >
        <Mark good={good} />
        <span>{label}</span>
      </p>
    </div>
  );
}

/** A whole page, framed and scaled to fit. `scripts/figures` sets the zoom. */
export function Screen({
  id,
  title,
  width,
}: {
  id: string;
  title: string;
  width?: number;
}) {
  return (
    <div className="fig-screen" data-fit-frame data-fill data-fit-width={width}>
      <iframe
        data-src={href(`/templates/preview/${id}`)}
        title={title}
        tabIndex={-1}
        inert
      />
    </div>
  );
}

export function Arrow({
  label,
  flip = false,
}: {
  label?: string;
  flip?: boolean;
}) {
  return (
    <span className={`fig-arrow ${flip ? "fig-arrow--flip" : ""}`}>
      {label && <em>{label}</em>}
      <svg viewBox="0 0 64 12" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 6h62"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <i aria-hidden="true" />
    </span>
  );
}
