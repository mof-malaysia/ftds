/**
 * Per-IP rate limit for /mcp, using the Workers rate limiting binding
 * (`ratelimits` in wrangler.jsonc). Counts are per Cloudflare location and
 * approximate, which is enough to stop one client running up the bill.
 */

/** The binding's shape (only what this file uses). */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/** Matches `simple.period` in wrangler.jsonc. */
const RETRY_AFTER_SECONDS = 60;

const RATE_LIMIT_MESSAGE =
  "Too many requests to the FTDS playground; wait a minute and try again.";

let warnedMissing = false;

/**
 * Returns a 429 response when the client is over the limit, or null to let
 * the request through. Without a binding (old config, tests) every request
 * goes through, and that is logged once.
 */
export async function rateLimit(
  request: Request,
  limiter: RateLimiter | undefined,
): Promise<Response | null> {
  if (!limiter) {
    if (!warnedMissing) {
      warnedMissing = true;
      console.warn("MCP_LIMITER binding is missing; /mcp is not rate limited");
    }
    return null;
  }

  const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const { success } = await limiter.limit({ key });
  if (success) return null;

  // JSON-RPC error with a null id: the request body is not read, so its id is unknown.
  const body = {
    jsonrpc: "2.0",
    error: { code: -32000, message: RATE_LIMIT_MESSAGE },
    id: null,
  };
  return Response.json(body, {
    status: 429,
    headers: { "Retry-After": String(RETRY_AFTER_SECONDS) },
  });
}
