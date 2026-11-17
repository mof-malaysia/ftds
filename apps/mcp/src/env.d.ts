/** The built preview page, bundled into the Worker as text (wrangler.jsonc rules). */
declare module "*.html" {
  const html: string;
  export default html;
}

/** Bindings from wrangler.jsonc. */
interface Env {
  /** Optional so an old config or a test without the binding still runs. */
  MCP_LIMITER?: import("./worker/rate-limit").RateLimiter;
}
