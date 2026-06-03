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

// sendUserMessage 向当前对话中追加一条用户消息。
// 这是纯函数——不修改传入的 state，而是返回一个全新的 ConversationState 对象（不可变更新）。
// 在 v0 阶段，它只做本地内存追加，不触发模型调用、不写文件、不发网络请求。
export function sendUserMessage(
  // 当前对话状态，包含 meta 元信息和已有消息列表
  state: ConversationState,
  // 用户在输入框中输入的原始文本
  content: string,
): ConversationState {
  console.log("sendUserMessage", content);
  // 去掉输入文本首尾的空白字符（空格、换行等）
  const trimmedContent = content.trim();

  // 防御性检查：如果用户输入的全是空格或什么都没输入，
  // 直接原样返回当前状态，不追加空消息，避免脏数据
  if (!trimmedContent) {
    return state;
  }

  // 获取当前 ISO 8601 时间戳，作为消息创建时间和状态更新时间
  const createdAt = nowIso();

  // 构造一条新的用户消息对象
  const userMessage: AgentMessage = {
    // 用 "msg" 前缀 + 随机 ID 生成全局唯一标识
    id: createId("msg"),
    // 消息归属当前对话，保证不会被串到其他会话
    conversationId: state.meta.id,
    // 消息角色为 user，区别于 system/assistant/tool
    role: "user",
    // 存储去掉空白后的实际内容
    content: trimmedContent,
    // 记录消息创建时间
    createdAt,
  };

  // 不可变更新：用展开运算符创建新数组，原子数组保持不变
  // 新数组 = 旧消息列表 + 新用户消息（追加到末尾）
  const messages = [...state.messages, userMessage];

  // 返回全新的 ConversationState 对象
  return {
    meta: {
      // 复制原有 meta 字段（id、title、createdAt 不变）
      ...state.meta,
      // 更新最后修改时间，用于排序和展示
      updatedAt: createdAt,
      // 更新消息总数，由新 messages 数组长度决定
      messageCount: messages.length,
    },
    // 替换为新消息列表
    messages,
  };
}
