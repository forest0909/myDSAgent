import { describe, expect, it } from "vitest";
import { createConversationState, sendUserMessage } from "./conversation";

describe("conversation state", () => {
  it("starts with a system welcome message and appends user messages", () => {
    const state = createConversationState("conv_test");

    const next = sendUserMessage(state, "Build the smallest useful agent shell");

    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]?.role).toBe("system");
    expect(state.messages[0]?.content).toBe(
      "Agent 外壳已就绪。v0 不会调用模型，也不会启用本地工具。",
    );
    expect(state.meta.title).toBe("本地 Agent 外壳");
    expect(next.messages).toHaveLength(2);
    expect(next.messages[1]).toMatchObject({
      conversationId: "conv_test",
      role: "user",
      content: "Build the smallest useful agent shell",
    });
  });
});
