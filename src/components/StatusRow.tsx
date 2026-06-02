interface StatusRowProps {
  label: string;
  value: string;
  tone: "ready" | "muted";
}

export default function StatusRow({ label, value, tone }: StatusRowProps) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </div>
  );
}
