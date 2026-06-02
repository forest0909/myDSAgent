# myDSAgent

Minimal cross-platform desktop Agent skeleton built with Tauri, React, TypeScript,
and Rust.

## Version 0 Scope

- Tauri v2 desktop shell.
- React + TypeScript workspace UI.
- Minimal in-memory Agent Core.
- Typed Tauri gateway.
- Rust `health_check` command for bridge verification.
- No model calls.
- No shell execution.
- No filesystem writes.
- No durable JSONL storage yet.

Project rules for AI-assisted development live in `AGENTS.md`.

## Development

Install dependencies:

```bash
pnpm install
```

Run checks:

```bash
pnpm test
pnpm typecheck
pnpm build
PATH="/Users/zzl/.cargo/bin:$PATH" cargo check --manifest-path src-tauri/Cargo.toml
```

Run the desktop app:

```bash
PATH="/Users/zzl/.cargo/bin:$PATH" pnpm tauri dev
```
