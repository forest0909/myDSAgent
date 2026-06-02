import type { FormEvent } from "react";

interface ComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function Composer({ draft, onDraftChange, onSubmit }: ComposerProps) {
  return (
    <form className="composer" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="message-input">
        消息
      </label>
      <input
        id="message-input"
        value={draft}
        onChange={(event) => onDraftChange(event.currentTarget.value)}
        placeholder="为本地对话输入消息..."
      />
      <button type="submit" disabled={!draft.trim()}>
        发送
      </button>
    </form>
  );
}
