// @ts-check

import { describe, it, before, after } from "node:test";
import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

describe("server", () => {
  /** @type {import("node:http").Server} */
  let _server;

  before(async () => {
    _server = (await import("./server.js")).server;
    await new Promise((resolve) => _server.once("listening", resolve));
  });

  after(() => _server.close());

  it("should receive request", async () => {
    const request = await fetch(`${BASE_URL}`);

    const response = await request.json();

    assert.strictEqual(response, "");
  });
});
