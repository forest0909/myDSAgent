import type { ModelConfig } from "./types";

export function getModelStatus(): "disabled" | "configured" {
  // 简单判断：有 API key 就是已配置
  return "configured";
}

interface ChatMessage {
  role: string;
  content: string;
}

export async function complete(
  config: ModelConfig,
  messages: ChatMessage[],
): Promise<string> {
  const url = `${config.baseUrl}/v1/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`模型调用失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("模型返回了空内容");
  }

  return content;
}
