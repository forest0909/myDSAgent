# AGENTS.md

This file is the project contract for AI-assisted development in Agent Demo.
Every agent working in this repository must preserve these boundaries unless a
future task explicitly changes them.

## Project Goal

Build a cross-platform desktop Agent app for macOS, Windows, and Linux.

Version 0 is intentionally small:

- A Tauri desktop shell.
- A React + TypeScript UI.
- A minimal TypeScript Agent Core.
- A Rust command bridge health check.
- No model calls.
- No real tools.
- No durable conversation storage yet.

## Architecture Rules

### UI Layer

- UI renders state and collects input only.
- UI must not read or write local files.
- UI must not execute shell commands.
- UI must not call model providers directly.
- UI must call local desktop capabilities only through typed gateway modules.

### Agent Core Layer

- Agent Core owns conversation state, planning interfaces, execution interfaces,
  and model-client interfaces.
- Agent Core must not touch system paths.
- Agent Core must not call Tauri commands directly.
- Planner, executor, and LLM client remain disabled stubs in v0.

### Platform Layer

- `src/platform/*` is the only frontend layer allowed to wrap Tauri `invoke`.
- Gateway functions must expose typed inputs and outputs.
- Gateway functions must handle browser/dev fallback explicitly.

### Tauri / Rust Layer

- Rust commands own local system access.
- Rust commands must be small, typed, and permission-aware.
- Do not add broad filesystem, shell, clipboard, or notification access without a
  task that explicitly asks for it.
- Every new command must define input, output, permission, failure behavior, and
  tests before implementation.

## Storage Rules

Durable storage is not implemented in v0. Future conversation storage must use:

```txt
app-data/
├─ conversations/
│  ├─ conv_001.jsonl
│  └─ conv_002.jsonl
├─ index.json
├─ config.json
└─ cache/
```

- Use one JSONL file per conversation.
- JSONL message files are append-only by default.
- `index.json` may be rewritten because it is small and acts as the session list.
- Frontend code must never construct app-data paths directly.
- Rust storage code must validate conversation IDs before mapping them to files.

## Security Rules

- Do not write API keys, tokens, complete environment variables, or secrets to
  JSONL, logs, screenshots, test snapshots, or docs.
- Do not store sensitive user content outside the planned app-data storage area.
- Do not add shell execution in v0.
- Do not add real LLM requests in v0.
- Do not silently broaden Tauri permissions.

## Development Rules

- Use `pnpm` for frontend dependency management.
- Use `PATH="/Users/zzl/.cargo/bin:$PATH"` when running Tauri or Cargo locally.
- Prefer small modules with typed boundaries over large components.
- Keep `App.tsx` as composition glue; move reusable behavior into `agent-core`
  or `platform`.
- Add tests before behavior changes when practical.
- Run verification before claiming completion:
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm build`
  - `PATH="/Users/zzl/.cargo/bin:$PATH" pnpm tauri dev`

## Version 0 Definition of Done

- Desktop app opens.
- Initial Agent workspace UI is visible.
- User input appends to the local in-memory conversation.
- `health_check` proves the Rust bridge can respond.
- Status area shows desktop bridge, Agent Core, and model state.
- No real model call, file write, shell execution, clipboard access, or
  notification is implemented.
