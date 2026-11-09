/**
 * Stack, density and theme. They live on <html>, are remembered, and apply to
 * every example on the page. The plate re-measures whenever one changes.
 */
import { remeasureAll, watchFrames } from "./measure";

const root = document.documentElement;
const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private windows may refuse storage; the choice still applies to this page
  }
};

const read: Record<string, () => string> = {
  stack: () => root.dataset.stack ?? "react",
  density: () => root.dataset.demoDensity ?? "comfortable",
  theme: () => (root.classList.contains("dark") ? "dark" : "light"),
};

const write: Record<string, (value: string) => void> = {
  stack: (value) => {
    root.dataset.stack = value;
    save("ftds-docs-stack", value);
  },
  density: (value) => {
    root.dataset.demoDensity = value;
    save("ftds-docs-density", value);
    applyDensity();
  },
  theme: (value) => {
    root.classList.toggle("dark", value === "dark");
    root.classList.toggle("light", value === "light");
    save("theme", value);
  },
};

function applyDensity() {
  const density = read.density();
  document
    .querySelectorAll<HTMLElement>("[data-stage]:not([data-density-locked])")
    .forEach((stage) => {
      stage.dataset.density = density;
    });
}

function sync() {
  document
    .querySelectorAll<HTMLElement>("[data-condition]")
    .forEach((group) => {
      const value = read[group.dataset.condition!]();
      group.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.value === value),
        );
      });
    });
}

/** A page with one stack shows that stack, whatever the reader chose elsewhere. */
function settleStack() {
  const group = document.querySelector<HTMLElement>('[data-condition="stack"]');
  const preferred = group?.querySelector<HTMLButtonElement>(
    `[data-value="${read.stack()}"]`,
  );
  if (preferred?.disabled) {
    const other = group!.querySelector<HTMLButtonElement>(
      "button:not(:disabled)",
    );
    if (other) root.dataset.stack = other.dataset.value;
  }
}

document.addEventListener("click", (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>(
    "[data-condition] button",
  );
  if (button) {
    write[button.closest<HTMLElement>("[data-condition]")!.dataset.condition!](
      button.dataset.value!,
    );
    sync();
    remeasureAll();
    return;
  }

  const pick = (event.target as Element).closest<HTMLElement>(
    "[data-pick-stack]",
  );
  if (pick) write.stack(pick.dataset.pickStack!);
});

settleStack();
applyDensity();
sync();
remeasureAll();

// Islands fill in after load; measure again once they have
// (captured, because the event doesn't bubble)
document.addEventListener("astro:hydrate", remeasureAll, true);
window.addEventListener("load", remeasureAll);
document.fonts?.ready.then(remeasureAll);
watchFrames();

// Anything that scrolls sideways has to be reachable by keyboard
document.querySelectorAll<HTMLElement>("pre, .prose table").forEach((el) => {
  if (el.scrollWidth > el.clientWidth) el.tabIndex = 0;
});

// Keep the current page visible in the rail
const tree = document.querySelector<HTMLElement>("[data-rail] .doc-tree");
const here = tree?.querySelector<HTMLElement>('[aria-current="page"]');
if (tree && here) {
  const box = tree.getBoundingClientRect();
  const link = here.getBoundingClientRect();
  if (link.top < box.top || link.bottom > box.bottom) {
    tree.scrollTop = link.top - box.top - tree.clientHeight / 2;
  }
}

// On phones tables stack, so each cell carries its column's name
document.querySelectorAll<HTMLTableElement>(".prose table").forEach((table) => {
  const labels = [...table.querySelectorAll("thead th")].map(
    (th) => th.textContent?.trim() ?? "",
  );
  table.querySelectorAll("tbody tr").forEach((row) => {
    [...row.children].forEach((cell, i) => {
      if (labels[i]) (cell as HTMLElement).dataset.label = labels[i];
    });
  });
});
