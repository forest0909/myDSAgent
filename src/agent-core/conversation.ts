import type { AgentMessage, ConversationState, ModelConfig } from "./types";
import { complete } from "./llm-client";

const welcomeMessage = "Agent 外壳已就绪。输入消息开始对话。";

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

// sendUserMessage 追加用户消息，调用模型获取回复，返回新的 ConversationState。
export async function sendUserMessage(
  state: ConversationState,
  content: string,
  config: ModelConfig,
): Promise<ConversationState> {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return state;
  }

  const now = nowIso();

  // 1. 追加用户消息
  const userMessage: AgentMessage = {
    id: createId("msg"),
    conversationId: state.meta.id,
    role: "user",
    content: trimmedContent,
    createdAt: now,
  };

  let messages = [...state.messages, userMessage];

  // 2. 调用模型获取回复
  let replyContent: string;
  try {
    replyContent = await complete(
      config,
      messages.map((m) => ({ role: m.role, content: m.content })),
    );
  } catch (error) {
    replyContent = `[错误] 模型调用失败: ${error instanceof Error ? error.message : String(error)}`;
  }

  // 3. 追加 assistant 消息
  const assistantMessage: AgentMessage = {
    id: createId("msg"),
    conversationId: state.meta.id,
    role: "assistant",
    content: replyContent,
    createdAt: nowIso(),
  };

  messages = [...messages, assistantMessage];

  return {
    meta: {
      ...state.meta,
      updatedAt: nowIso(),
      messageCount: messages.length,
    },
    messages,
  };
}
