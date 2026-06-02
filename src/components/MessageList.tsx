import type { AgentMessage, AgentRole } from "../agent-core/types";

interface MessageListProps {
  messages: AgentMessage[];
  roleLabels: Record<AgentRole, string>;
}

export default function MessageList({ messages, roleLabels }: MessageListProps) {
  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message) => (
        <article className={`message ${message.role}`} key={message.id}>
          <span className="message-role">{roleLabels[message.role]}</span>
          <p>{message.content}</p>
        </article>
      ))}
    </div>
  );
}
