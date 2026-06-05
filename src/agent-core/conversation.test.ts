import { describe, expect, it, vi } from "vitest";
import { createConversationState, sendUserMessage } from "./conversation";
import type { ModelConfig } from "./types";

// Mock llm-client，避免测试中真实网络请求
vi.mock("./llm-client", () => ({
  complete: vi.fn().mockResolvedValue("你好，我是 AI 助手。"),
  getModelStatus: () => "configured" as const,
}));

const testConfig: ModelConfig = {
  provider: "openai",
  model: "test-model",
  apiKey: "test-key",
  baseUrl: "http://localhost:11434/v1",
};

describe("conversation state", () => {
  it("starts with a system welcome message", () => {
    const state = createConversationState("conv_test");

    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]?.role).toBe("system");
    expect(state.messages[0]?.content).toBe(
      "Agent 外壳已就绪。输入消息开始对话。",
    );
    expect(state.meta.title).toBe("本地 Agent 外壳");
  });

  it("appends user message and gets model reply", async () => {
    const state = createConversationState("conv_test");

    const next = await sendUserMessage(
      state,
      "Build the smallest useful agent shell",
      testConfig,
    );

    // 原 state 不可变
    expect(state.messages).toHaveLength(1);

    // 新 state 有 system + user + assistant 三条消息
    expect(next.messages).toHaveLength(3);
    expect(next.messages[1]).toMatchObject({
      conversationId: "conv_test",
      role: "user",
      content: "Build the smallest useful agent shell",
    });
    expect(next.messages[2]).toMatchObject({
      conversationId: "conv_test",
      role: "assistant",
      content: "你好，我是 AI 助手。",
    });
    expect(next.meta.messageCount).toBe(3);
  });

  it("ignores empty input", async () => {
    const state = createConversationState("conv_test");

    const next = await sendUserMessage(state, "   ", testConfig);

    expect(next).toBe(state);
    expect(next.messages).toHaveLength(1);
  });
});
