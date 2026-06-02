import { invoke } from "@tauri-apps/api/core";
import type { HealthCheckResult } from "../agent-core/types";

function isTauriRuntime(): boolean {
  return (
    typeof window !== "undefined" &&
    "__TAURI_INTERNALS__" in window
  );
}

export async function healthCheck(): Promise<HealthCheckResult> {
  if (!isTauriRuntime()) {
    return {
      ok: false,
      app: "agent-demo",
      reason: "tauri-bridge-unavailable",
    };
  }

  try {
    return await invoke<HealthCheckResult>("health_check");
  } catch {
    return {
      ok: false,
      app: "agent-demo",
      reason: "tauri-command-failed",
    };
  }
}
