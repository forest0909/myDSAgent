# AGENTS.md

本文件是 Agent Demo 项目的 AI 辅助开发契约。
除非未来任务明确修改这些边界，否则每位在本仓库工作的 agent 都必须遵守。

## 项目目标

构建一个面向 macOS、Windows 和 Linux 的跨平台桌面 Agent 应用。

版本 0 有意保持很小：

- 一个 Tauri 桌面外壳。
- 一个 React + TypeScript UI。
- 一个最小 TypeScript Agent Core。
- 一个 Rust 命令桥接健康检查。
- 不调用模型。
- 不接入真实工具。
- 暂不实现持久化会话存储。

## 架构规则

### UI 层

- UI 只负责渲染状态和收集输入。
- UI 不得读取或写入本地文件。
- UI 不得执行 shell 命令。
- UI 不得直接调用模型提供商。
- UI 只能通过类型化 gateway 模块调用本地桌面能力。

### Agent Core 层

- Agent Core 拥有会话状态、规划接口、执行接口和模型客户端接口。
- Agent Core 不得触碰系统路径。
- Agent Core 不得直接调用 Tauri 命令。
- v0 中，规划器、执行器和 LLM 客户端仍保持禁用的占位实现。

### Platform 层

- `src/platform/*` 是前端层中唯一允许封装 Tauri `invoke` 的位置。
- Gateway 函数必须暴露类型化输入和输出。
- Gateway 函数必须显式处理浏览器/开发环境 fallback。

### Tauri / Rust 层

- Rust 命令拥有本地系统访问能力。
- Rust 命令必须小而类型化，并且具备权限意识。
- 没有明确要求时，不得加入宽泛的文件系统、shell、剪贴板或通知访问。
- 每个新命令必须先定义输入、输出、权限、失败行为和测试，再实现。

## 存储规则

v0 尚未实现持久化存储。未来的会话存储必须使用：

```txt
app-data/
├─ conversations/
│  ├─ conv_001.jsonl
│  └─ conv_002.jsonl
├─ index.json
├─ config.json
└─ cache/
```

- 每个会话使用一个 JSONL 文件。
- JSONL 消息文件默认只追加写入。
- `index.json` 可以被重写，因为它很小，并且充当会话列表。
- 前端代码绝不能直接构造 app-data 路径。
- Rust 存储代码必须先验证会话 ID，再将其映射到文件。

## 安全规则

- 不得把 API key、token、完整环境变量或其他密钥写入 JSONL、日志、截图、测试快照或文档。
- 不得把敏感用户内容存储到规划的 app-data 存储区之外。
- v0 不得加入 shell 执行。
- v0 不得加入真实 LLM 请求。
- 不得静默扩大 Tauri 权限。

## 开发规则

- 前端依赖管理使用 `pnpm`。
- 本地运行 Tauri 或 Cargo 时使用 `PATH="/Users/zzl/.cargo/bin:$PATH"`。
- 优先使用带类型边界的小模块，而不是大型组件。
- 保持 `App.tsx` 作为组合胶水；可复用行为应移到 `agent-core` 或 `platform`。
- 实际可行时，在行为变更前先添加测试。
- 声称完成前必须运行验证：
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm build`
  - `PATH="/Users/zzl/.cargo/bin:$PATH" pnpm tauri dev`

## 版本 0 完成定义

- 桌面应用可以打开。
- 初始 Agent 工作区 UI 可见。
- 用户输入会追加到本地内存会话。
- `health_check` 能证明 Rust 桥接可以响应。
- 状态区域显示桌面桥接、Agent Core 和模型状态。
- 不实现真实模型调用、文件写入、shell 执行、剪贴板访问或通知。
