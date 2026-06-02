import type { AgentMessage, ConversationState } from "./types";

const welcomeMessage =
  "Agent 外壳已就绪。v0 不会调用模型，也不会启用本地工具。";

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  const randomId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
  return `${prefix}_${randomId}`;
}

export function createConversationState(
  conversationId = "conv_local",
): ConversationState {
  const createdAt = nowIso();
  const systemMessage: AgentMessage = {
    id: createId("msg"),
    conversationId,
    role: "system",
    content: welcomeMessage,
    createdAt,
  };

  return {
    meta: {
      id: conversationId,
      title: "本地 Agent 外壳",
      createdAt,
      updatedAt: createdAt,
      messageCount: 1,
    },
    messages: [systemMessage],
  };
}

export function sendUserMessage(
  state: ConversationState,
  content: string,
): ConversationState {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return state;
  }

  const createdAt = nowIso();
  const userMessage: AgentMessage = {
    id: createId("msg"),
    conversationId: state.meta.id,
    role: "user",
    content: trimmedContent,
    createdAt,
  };
  const messages = [...state.messages, userMessage];

  return {
    meta: {
      ...state.meta,
      updatedAt: createdAt,
      messageCount: messages.length,
    },
    messages,
  };
}
