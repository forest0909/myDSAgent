interface SessionInfo {
  id: string;
  title: string;
  count: number;
}

interface SidebarProps {
  sessions: SessionInfo[];
  onNewChat: () => void;
}

export default function Sidebar({ sessions, onNewChat }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="对话列表">
      <div className="brand">
        <span className="brand-mark">A</span>
        <div>
          <strong>Agent 演示</strong>
          <span>桌面骨架</span>
        </div>
      </div>
      <button className="new-chat-button" type="button" onClick={onNewChat}>
        新建对话
      </button>
      <div className="session-list">
        {sessions.map((session) => (
          <button className="session-item active" type="button" key={session.id}>
            <span>{session.title}</span>
            <small>{session.count} 条消息</small>
          </button>
        ))}
      </div>
    </aside>
  );
}
