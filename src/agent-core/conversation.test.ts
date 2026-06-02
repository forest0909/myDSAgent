import { describe, expect, it } from "vitest";
import { createConversationState, sendUserMessage } from "./conversation";

describe("conversation state", () => {
  it("starts with a system welcome message and appends user messages", () => {
    const state = createConversationState("conv_test");

    const next = sendUserMessage(state, "Build the smallest useful agent shell");

    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]?.role).toBe("system");
    expect(next.messages).toHaveLength(2);
    expect(next.messages[1]).toMatchObject({
      conversationId: "conv_test",
      role: "user",
      content: "Build the smallest useful agent shell",
    });
  });
});
