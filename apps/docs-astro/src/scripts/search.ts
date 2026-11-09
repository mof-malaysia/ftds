/**
 * ⌘K search over a static index (pages/search.json.ts). Opens a native
 * <dialog>, so focus trapping and Escape come from the platform.
 */
interface Doc {
  t: string;
  d: string;
  u: string;
  g: string;
}

const dialog = document.querySelector<HTMLDialogElement>("[data-search]");

if (dialog) {
  const input = dialog.querySelector("input")!;
  const list = dialog.querySelector("ul")!;
  const empty = dialog.querySelector<HTMLElement>(".doc-search-empty")!;
  let index: Doc[] | undefined;
  let active = 0;

  const load = async () => {
    index ??= await fetch(dialog.dataset.index!).then((r) => r.json());
  };

  const score = (doc: Doc, q: string) => {
    const title = doc.t.toLowerCase();
    if (title === q) return 100;
    if (title.startsWith(q)) return 80;
    if (title.includes(q)) return 60;
    return doc.d.toLowerCase().includes(q) ? 20 : 0;
  };

  const paint = () => {
    const items = [...list.children] as HTMLElement[];
    items.forEach((item, i) =>
      item.setAttribute("aria-selected", String(i === active)),
    );
    items[active]?.scrollIntoView({ block: "nearest" });
  };

  const show = () => {
    const q = input.value.trim().toLowerCase();
    const results = !q
      ? (index ?? []).filter((doc) => doc.g !== "Components").slice(0, 8)
      : (index ?? [])
          .map((doc) => [score(doc, q), doc] as const)
          .filter(([s]) => s > 0)
          .sort((a, b) => b[0] - a[0])
          .slice(0, 12)
          .map(([, doc]) => doc);

    list.replaceChildren(
      ...results.map((doc) => {
        const li = document.createElement("li");
        li.setAttribute("role", "option");
        const a = document.createElement("a");
        a.href = doc.u;
        const title = document.createElement("b");
        title.textContent = doc.t;
        const group = document.createElement("span");
        group.textContent = doc.g;
        const desc = document.createElement("small");
        desc.textContent = doc.d;
        a.append(title, group, desc);
        li.append(a);
        return li;
      }),
    );
    empty.hidden = results.length > 0 || !q;
    active = 0;
    paint();
  };

  const open = async () => {
    if (dialog.open) return;
    dialog.showModal();
    input.value = "";
    await load();
    show();
  };

  document.addEventListener("click", (event) => {
    if ((event.target as Element).closest("[data-search-open]")) void open();
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    const typing = (event.target as Element).matches(
      "input, textarea, select, [contenteditable]",
    );
    if (
      (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
      (event.key === "/" && !typing)
    ) {
      event.preventDefault();
      void open();
    }
  });

  input.addEventListener("input", show);
  input.addEventListener("keydown", (event) => {
    const count = list.children.length;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      active =
        (active + (event.key === "ArrowDown" ? 1 : count - 1)) %
        Math.max(count, 1);
      paint();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      list.children[active]?.querySelector("a")?.click();
    }
  });
}
