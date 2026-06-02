export function getModelStatus(): "disabled" {
  return "disabled";
}

export async function completeWithModel(): Promise<never> {
  throw new Error("LLM client is disabled in v0.");
}
