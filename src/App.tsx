import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  createConversationState,
  sendUserMessage,
} from "./agent-core/conversation";
import type { AgentRole, AgentStatus, ModelConfig } from "./agent-core/types";
import { getExecutorStatus } from "./agent-core/executor";
import { getModelStatus } from "./agent-core/llm-client";
import { healthCheck } from "./platform/tauri-gateway";
import ChatPanel from "./components/ChatPanel";
import Sidebar from "./components/Sidebar";
import StatusPanel from "./components/StatusPanel";

const roleLabels: Record<AgentRole, string> = {
  system: "系统",
  user: "用户",
  assistant: "助手",
  tool: "工具",
};

// baseUrl 填 API 主机地址（不含 /v1），代码内部拼接 /v1/chat/completions
const modelConfig: ModelConfig = {
  provider: "openai",
  model: import.meta.env.VITE_MODEL_NAME || "qwen2.5:latest",
  apiKey: import.meta.env.VITE_MODEL_API_KEY || "ollama",
  baseUrl: import.meta.env.VITE_MODEL_BASE_URL || "http://localhost:11434",
};

function App() {
  const [conversation, setConversation] = useState(() =>
    createConversationState(),
  );
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    desktop: "checking",
    core: getExecutorStatus(),
    model: getModelStatus(),
  });

  useEffect(() => {
    let cancelled = false;

    async function checkDesktopBridge() {
      const health = await healthCheck();
      if (!cancelled) {
        setAgentStatus((current) => ({
          ...current,
          desktop: health.ok ? "ready" : "unavailable",
        }));
      }
    }

    checkDesktopBridge();

    return () => {
      cancelled = true;
    };
  }, []);

  const sessions = useMemo(
    () => [
      {
        id: conversation.meta.id,
        title: conversation.meta.title,
        count: conversation.meta.messageCount,
      },
    ],
    [
      conversation.meta.id,
      conversation.meta.messageCount,
      conversation.meta.title,
    ],
  );

  function handleNewChat() {
    setConversation(createConversationState(`conv_${Date.now()}`));
    setDraft("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !draft.trim()) return;

    const userInput = draft;
    setDraft("");
    setLoading(true);

    const next = await sendUserMessage(conversation, userInput, modelConfig);
    setConversation(next);
    setLoading(false);
  }

  return (
    <main className="app-shell">
      <Sidebar sessions={sessions} onNewChat={handleNewChat} />
      <ChatPanel
        messages={conversation.messages}
        roleLabels={roleLabels}
        draft={draft}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
      />
      <StatusPanel agentStatus={agentStatus} />
    </main>
  );
}

export default App;
