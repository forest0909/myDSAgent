import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the initial agent workspace in Chinese", () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain("桌面 Agent 工作区");
    expect(markup).toContain("新建对话");
    expect(markup).toContain("1 条消息");
    expect(markup).toContain("系统");
    expect(markup).toContain("运行状态");
    expect(markup).toContain("桌面桥接");
    expect(markup).toContain("模型已禁用");
    expect(markup).toContain("为本地对话输入消息...");
  });
});
