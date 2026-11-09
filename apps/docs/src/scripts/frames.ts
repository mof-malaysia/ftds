/**
 * Page previews in iframes. Each one is a whole page, so they load only near
 * the viewport and a few at a time.
 */
const MAX_LOADING = 3;
const queue: HTMLIFrameElement[] = [];
let loading = 0;

function next() {
  while (loading < MAX_LOADING && queue.length) {
    const frame = queue.shift()!;
    loading++;
    const done = () => {
      loading--;
      next();
    };
    frame.addEventListener("load", done, { once: true });
    frame.addEventListener("error", done, { once: true });
    frame.src = frame.dataset.src!;
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      queue.push(entry.target as HTMLIFrameElement);
    }
    next();
  },
  { rootMargin: "300px" },
);

document
  .querySelectorAll<HTMLIFrameElement>("iframe[data-src]")
  .forEach((frame) => observer.observe(frame));

/**
 * Scale each framed page to fit. Observing the frame also covers tabs and stack
 * switches, which take a frame from hidden to shown.
 */
const fitter = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    const frame = target as HTMLElement;
    const iframe = frame.querySelector("iframe");
    if (!iframe || !frame.clientWidth) continue;
    const width = Number(frame.dataset.fitWidth ?? 1280);
    const zoom = frame.clientWidth / width;
    iframe.style.width = `${width}px`;
    iframe.style.zoom = String(zoom);
    if ("fill" in frame.dataset)
      iframe.style.height = `${frame.clientHeight / zoom}px`;
  }
});

document
  .querySelectorAll("[data-fit-frame]")
  .forEach((frame) => fitter.observe(frame));
