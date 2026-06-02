import type { AgentStatus } from "../agent-core/types";
import StatusRow from "./StatusRow";

interface StatusPanelProps {
  agentStatus: AgentStatus;
}

export default function StatusPanel({ agentStatus }: StatusPanelProps) {
  return (
    <aside className="status-panel" aria-label="运行状态">
      <h2>运行状态</h2>
      <StatusRow
        label="桌面桥接"
        value={
          agentStatus.desktop === "ready"
            ? "桌面已就绪"
            : agentStatus.desktop === "checking"
              ? "正在检查桥接"
              : "桥接不可用"
        }
        tone={agentStatus.desktop === "ready" ? "ready" : "muted"}
      />
      <StatusRow label="Agent 核心" value="Agent 核心空闲" tone="ready" />
      <StatusRow label="模型" value="模型已禁用" tone="muted" />
      <StatusRow label="规划器" value="规划器占位实现" tone="muted" />
      <StatusRow label="执行器" value="执行器占位实现" tone="muted" />
    </aside>
  );
}
