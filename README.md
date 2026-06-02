# myDSAgent

基于 Tauri、React、TypeScript 和 Rust 构建的极简跨平台桌面 Agent 骨架。

## 版本 0 范围

- Tauri v2 桌面壳。
- React + TypeScript 工作区 UI。
- 最小化内存 Agent Core。
- 类型化的 Tauri 网关。
- Rust `health_check` 命令，用于桥接验证。
- 无模型调用。
- 无 Shell 执行。
- 无文件系统写入。
- 尚未实现持久化 JSONL 存储。

AI 辅助开发的项目规则参见 `AGENTS.md`。

## 开发

安装依赖：

```bash
pnpm install
```

运行检查：

```bash
pnpm test
pnpm typecheck
pnpm build
PATH="/Users/zzl/.cargo/bin:$PATH" cargo check --manifest-path src-tauri/Cargo.toml
```

运行桌面应用：

```bash
pnpm tauri dev
```
