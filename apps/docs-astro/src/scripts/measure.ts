/**
 * The plate. Reads the real rendered size of the specimen and draws its
 * dimensions, so flipping density or stack moves the lines. Anything large
 * enough to be a layout is fitted to the sheet instead and not measured.
 */
/** The layout width blocks are fitted from: a laptop page on desktop, a tablet on a phone. */
const fitWidth = (available: number) => (available < 460 ? 640 : 960);
const MAX_ZOOM = 3;

function visibleStage(frame: HTMLElement) {
  return [...frame.querySelectorAll<HTMLElement>("[data-specimen]")].find(
    (el) => el.offsetParent !== null,
  );
}

function firstElement(stage: HTMLElement) {
  const island = stage.querySelector("astro-island");
  return (island?.firstElementChild ??
    stage.firstElementChild) as HTMLElement | null;
}

/**
 * The one control worth measuring, or nothing. A wrapper with several controls
 * is a layout, not a specimen; a bare link inside something else isn't either.
 */
function controlOf(root: HTMLElement): HTMLElement | undefined {
  const isVisible = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();
    return box.width >= 16 && box.height >= 12;
  };
  if (root.matches("button, input, select, textarea, a"))
    return isVisible(root) ? root : undefined;
  const controls = [
    ...root.querySelectorAll<HTMLElement>(
      "button, input, select, textarea, [role=switch], [role=checkbox]",
    ),
  ].filter(isVisible);
  if (controls.length !== 1) return undefined;
  // A small button inside a bigger thing (a close icon on a callout) isn't the specimen
  return controls[0].getBoundingClientRect().width >=
    root.getBoundingClientRect().width * 0.6
    ? controls[0]
    : undefined;
}

function line(
  host: HTMLElement,
  key: string,
  box: Record<string, number>,
  text?: string,
  placement = "",
) {
  let el = host.querySelector<HTMLElement>(`[data-dim="${key}"]`);
  if (!el) {
    el = document.createElement("div");
    el.dataset.dim = key;
    el.className = `dim ${placement}`;
    el.innerHTML = "<span></span>";
    host.append(el);
  }
  el.style.left = `${box.x}px`;
  el.style.top = `${box.y}px`;
  el.style.width = `${box.w}px`;
  el.style.height = `${box.h}px`;
  el.firstElementChild!.textContent = text ?? "";
}

function channels(color: string): number[] | undefined {
  const parts = color.match(/[\d.]+/g)?.map(Number);
  if (!parts || parts.length < 3 || (parts.length > 3 && parts[3] < 1))
    return undefined;
  return parts.slice(0, 3);
}

function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The control's own text against its own fill. Nothing when the fill is see-through. */
function contrastOf(style: CSSStyleDeclaration) {
  const text = channels(style.color);
  const fill = channels(style.backgroundColor);
  if (!text || !fill) return undefined;
  const [a, b] = [luminance(text), luminance(fill)].sort((x, y) => y - x);
  return ((a + 0.05) / (b + 0.05)).toFixed(1);
}

const scaleText = (zoom: number) =>
  zoom < 1
    ? `${Math.round(zoom * 100)}%`
    : `${zoom.toFixed(2).replace(/\.?0+$/, "")}×`;

function measure(frame: HTMLElement) {
  const host = frame.querySelector<HTMLElement>("[data-dims]");
  const stage = visibleStage(frame);
  const note = frame.querySelector<HTMLElement>("[data-scale-note]");
  if (!host || !stage) return;

  stage.style.zoom = "1";
  stage.style.width = "";
  const root = firstElement(stage);
  if (!root) return;

  const forcedFit = frame.dataset.mode === "fit";
  const natural = root.getBoundingClientRect();
  const available = frame.clientWidth;

  const target =
    forcedFit || frame.dataset.mode === "show" ? undefined : controlOf(root);
  const scrolls = root.scrollWidth > root.clientWidth + 1;

  if (!target || scrolls || natural.height > 160 || natural.width > 560) {
    host.replaceChildren();
    frame.dataset.fitted = "";
    // Blocks lay out at page width and shrink to fit. Smaller things stay near
    // real size: the sheet's own width, enlarged when they are narrow.
    let width = forcedFit ? fitWidth(available) : available;
    stage.style.width = `${width}px`;
    let zoom = available / width;
    stage.style.zoom = String(zoom);
    // Wider than the sheet at its own size: use that width, so nothing is cut off
    const needed = root.scrollWidth;
    if (!forcedFit && needed > width - 48) {
      width = needed + 48;
      stage.style.width = `${width}px`;
      zoom = available / width;
      stage.style.zoom = String(zoom);
    } else if (!forcedFit) {
      const own = root.getBoundingClientRect().width;
      if (own < available * 0.7) {
        stage.style.width = "auto";
        zoom = Math.min(2, (available - 64) / own);
        width = own;
        stage.style.zoom = String(zoom);
      }
    }
    const tall = stage.getBoundingClientRect().height;
    const ratio = frame.clientHeight / tall;
    let cropped = ratio < 1;
    // Shrink a slightly tall block to show all of it; crop only the very tall
    if (cropped && (ratio >= 0.6 || "fitWhole" in frame.dataset)) {
      zoom *= ratio;
      stage.style.zoom = String(zoom);
      cropped = false;
    }
    frame.toggleAttribute(
      "data-narrow",
      stage.getBoundingClientRect().width < available - 2,
    );
    if (note)
      note.textContent =
        zoom === 1
          ? ""
          : `Shown at ${scaleText(zoom)}${cropped ? ", top of the block" : ""}`;
    return;
  }

  delete frame.dataset.fitted;
  const small = available < 460;
  const fixed = Number(frame.dataset.fixedZoom);
  const applied = Math.max(
    fixed ||
      Math.min(
        small ? 2 : MAX_ZOOM,
        (available - (small ? 136 : 180)) / natural.width,
      ),
    1,
  );
  stage.style.zoom = String(applied);

  const frameBox = frame.getBoundingClientRect();
  const box = target.getBoundingClientRect();
  const style = getComputedStyle(target);
  const x = box.left - frameBox.left;
  const y = box.top - frameBox.top;
  const h = Math.round(box.height / applied);
  const padding = parseFloat(style.paddingLeft) || 0;
  const paddingShown = padding * applied;
  const radius = parseFloat(style.borderTopLeftRadius) || 0;
  const size = parseFloat(style.fontSize);
  const weight = style.fontWeight;

  line(
    host,
    "height",
    { x: x - 26, y, w: 1, h: box.height },
    String(h),
    "dim-v",
  );
  // Above the control when there is room; a label or hint up there pushes it below
  const rootTop = root.getBoundingClientRect().top - frameBox.top;
  const roomAbove = y - rootTop < 8;
  const widthY = roomAbove ? y - 26 : y + box.height + 46;
  line(
    host,
    "width",
    { x, y: widthY, w: box.width, h: 1 },
    String(Math.round(box.width / applied)),
    roomAbove ? "dim-h" : "dim-h dim-under",
  );
  if (padding > 0)
    line(
      host,
      "padding",
      { x, y: y + box.height + 22, w: paddingShown, h: 1 },
      String(Math.round(padding)),
      "dim-h dim-under",
    );
  else host.querySelector('[data-dim="padding"]')?.remove();
  if (radius > 0 && radius < 100)
    line(
      host,
      "radius",
      { x: x + box.width - 1, y: y + box.height + 22, w: 1, h: 1 },
      `radius ${Math.round(radius)}`,
      "dim-label dim-end",
    );
  else host.querySelector('[data-dim="radius"]')?.remove();

  const contrast = contrastOf(style);
  if (note) {
    // Paired panes are narrow: there, the scale is all that fits on one line
    const detail = small
      ? ""
      : `. Text ${Math.round(size)}px, weight ${weight}${contrast ? `, contrast ${contrast}:1` : ""}`;
    note.textContent = `Shown at ${scaleText(applied)}${detail}`;
  }
}

export function remeasureAll() {
  document.querySelectorAll<HTMLElement>("[data-plate-frame]").forEach(measure);
}

const widths = new WeakMap<Element, number>();
const widthObserver = new ResizeObserver((entries) => {
  for (const { target, contentRect } of entries) {
    if (widths.get(target) === contentRect.width) continue;
    widths.set(target, contentRect.width);
    if (contentRect.width) measure(target as HTMLElement);
  }
});

/** Measure a frame again whenever its width changes, and only then. */
export function watchFrames() {
  document
    .querySelectorAll("[data-plate-frame]")
    .forEach((frame) => widthObserver.observe(frame));
}
