import type { AgentMessage, ConversationState } from "./types";

const welcomeMessage =
  "Agent shell is ready. Model calls and local tools are disabled in v0.";

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
      title: "Local Agent Shell",
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
