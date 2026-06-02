export function getExecutorStatus(): "idle" {
  return "idle";
}

export async function executeStep(): Promise<never> {
  throw new Error("Executor is disabled in v0.");
}
