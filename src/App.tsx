import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  createConversationState,
  sendUserMessage,
} from "./agent-core/conversation";
import type { AgentRole, AgentStatus } from "./agent-core/types";
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

function App() {
  const [conversation, setConversation] = useState(() =>
    createConversationState(),
  );
  const [draft, setDraft] = useState("");
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConversation((current) => sendUserMessage(current, draft));
    setDraft("");
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
