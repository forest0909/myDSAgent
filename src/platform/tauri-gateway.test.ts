import { describe, expect, it } from "vitest";
import { healthCheck } from "./tauri-gateway";

describe("tauri gateway", () => {
  it("returns a browser fallback when the Tauri bridge is unavailable", async () => {
    const health = await healthCheck();

    expect(health).toEqual({
      ok: false,
      app: "agent-demo",
      reason: "tauri-bridge-unavailable",
    });
  });
});
