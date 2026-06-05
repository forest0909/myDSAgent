export type AgentRole = "system" | "user" | "assistant" | "tool";

export interface AgentMessage {
  id: string;
  conversationId: string;
  role: AgentRole;
  content: string;
  createdAt: string;
  toolName?: string;
  metadata?: Record<string, unknown>;
}

export interface ConversationMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface ConversationState {
  meta: ConversationMeta;
  messages: AgentMessage[];
}

export interface AgentStatus {
  desktop: "checking" | "ready" | "unavailable";
  core: "idle";
  model: "disabled" | "configured";
}

export interface HealthCheckResult {
  ok: boolean;
  app: "agent-demo";
  reason?: "tauri-bridge-unavailable" | "tauri-command-failed";
}

export interface ModelConfig {
  provider: "openai";
  model: string;
  apiKey: string;
  baseUrl: string;
}
