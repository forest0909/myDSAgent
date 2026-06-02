import type { FormEvent } from "react";
import type { AgentMessage, AgentRole } from "../agent-core/types";
import Composer from "./Composer";
import MessageList from "./MessageList";

interface ChatPanelProps {
  messages: AgentMessage[];
  roleLabels: Record<AgentRole, string>;
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function ChatPanel({
  messages,
  roleLabels,
  draft,
  onDraftChange,
  onSubmit,
}: ChatPanelProps) {
  return (
    <section className="chat-panel" aria-label="Agent 对话">
      <header className="chat-header">
        <div>
          <h1>桌面 Agent 工作区</h1>
          <p>最小运行时外壳。模型调用和工具已禁用。</p>
        </div>
      </header>

      <MessageList messages={messages} roleLabels={roleLabels} />

      <Composer
        draft={draft}
        onDraftChange={onDraftChange}
        onSubmit={onSubmit}
      />
    </section>
  );
}
