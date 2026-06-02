export function getPlannerStatus(): "idle" {
  return "idle";
}

export async function planNextStep(): Promise<never> {
  throw new Error("Planner is disabled in v0.");
}
