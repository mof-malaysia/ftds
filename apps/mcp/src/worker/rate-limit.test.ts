import { test } from "node:test";
import assert from "node:assert/strict";
import { rateLimit, type RateLimiter } from "./rate-limit";

/** A fake binding: allows `limit` calls per key, then refuses. */
function fakeLimiter(limit: number) {
  const counts = new Map<string, number>();
  const limiter: RateLimiter = {
    async limit({ key }) {
      const count = (counts.get(key) ?? 0) + 1;
      counts.set(key, count);
      return { success: count <= limit };
    },
  };
  return { limiter, counts };
}

const request = (ip?: string) =>
  new Request("https://ftds.test/mcp", {
    method: "POST",
    headers: ip ? { "CF-Connecting-IP": ip } : {},
  });

test("requests under the limit go through, keyed on the client IP", async () => {
  const { limiter, counts } = fakeLimiter(2);
  assert.equal(await rateLimit(request("203.0.113.1"), limiter), null);
  assert.equal(await rateLimit(request("203.0.113.1"), limiter), null);
  assert.equal(await rateLimit(request("203.0.113.2"), limiter), null);
  assert.deepEqual(
    [...counts],
    [
      ["203.0.113.1", 2],
      ["203.0.113.2", 1],
    ],
  );
});

test("over the limit: 429 with Retry-After and a JSON-RPC error", async () => {
  const { limiter } = fakeLimiter(1);
  await rateLimit(request("203.0.113.1"), limiter);
  const response = await rateLimit(request("203.0.113.1"), limiter);

  assert.ok(response);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.match(response.headers.get("Content-Type") ?? "", /application\/json/);
  assert.deepEqual(await response.json(), {
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message:
        "Too many requests to the FTDS playground; wait a minute and try again.",
    },
    id: null,
  });
});

test("requests without CF-Connecting-IP share one key", async () => {
  const { limiter, counts } = fakeLimiter(5);
  await rateLimit(request(), limiter);
  assert.deepEqual([...counts.keys()], ["unknown"]);
});

test("a missing binding lets every request through and warns once", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  assert.equal(await rateLimit(request("203.0.113.1"), undefined), null);
  assert.equal(await rateLimit(request("203.0.113.1"), undefined), null);
  assert.equal(warn.mock.callCount(), 1);
});
