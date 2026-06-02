import { FormEvent, useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  createConversationState,
  sendUserMessage,
} from "./agent-core/conversation";
import type { AgentStatus } from "./agent-core/types";
import { getExecutorStatus } from "./agent-core/executor";
import { getModelStatus } from "./agent-core/llm-client";
import { healthCheck } from "./platform/tauri-gateway";

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
    [conversation.meta.id, conversation.meta.messageCount, conversation.meta.title],
  );

  function handleNewChat() {
    setConversation(createConversationState(`conv_${Date.now()}`));
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConversation((current) => sendUserMessage(current, draft));
    setDraft("");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Conversation list">
        <div className="brand">
          <span className="brand-mark">A</span>
          <div>
            <strong>Agent Demo</strong>
            <span>Desktop skeleton</span>
          </div>
        </div>
        <button className="new-chat-button" type="button" onClick={handleNewChat}>
          New Chat
        </button>
        <div className="session-list">
          {sessions.map((session) => (
            <button className="session-item active" type="button" key={session.id}>
              <span>{session.title}</span>
              <small>{session.count} messages</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-panel" aria-label="Agent conversation">
        <header className="chat-header">
          <div>
            <h1>Desktop Agent Workspace</h1>
            <p>Minimal runtime shell. Model calls and tools are disabled.</p>
          </div>
        </header>

        <div className="message-list" aria-live="polite">
          {conversation.messages.map((message) => (
            <article className={`message ${message.role}`} key={message.id}>
              <span className="message-role">{message.role}</span>
              <p>{message.content}</p>
            </article>
          ))}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="message-input">
            Message
          </label>
          <input
            id="message-input"
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
            placeholder="Type a message for the local conversation..."
          />
          <button type="submit" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      </section>

      <aside className="status-panel" aria-label="Runtime status">
        <h2>Runtime Status</h2>
        <StatusRow
          label="Desktop"
          value={
            agentStatus.desktop === "ready"
              ? "Desktop Ready"
              : agentStatus.desktop === "checking"
                ? "Checking Bridge"
                : "Bridge Unavailable"
          }
          tone={agentStatus.desktop === "ready" ? "ready" : "muted"}
        />
        <StatusRow label="Agent Core" value="Agent Core Idle" tone="ready" />
        <StatusRow label="Model" value="Model Disabled" tone="muted" />
        <StatusRow label="Planner" value="Planner Stub" tone="muted" />
        <StatusRow label="Executor" value="Executor Stub" tone="muted" />
      </aside>
    </main>
  );
}

interface StatusRowProps {
  label: string;
  value: string;
  tone: "ready" | "muted";
}

function StatusRow({ label, value, tone }: StatusRowProps) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </div>
  );
}

export default App;
