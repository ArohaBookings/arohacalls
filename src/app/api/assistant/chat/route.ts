import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAssistantSystemPrompt, localAssistantFallback } from "@/lib/assistant-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(12),
});

function extractResponseText(data: unknown) {
  if (typeof data !== "object" || !data) return null;
  const outputText = (data as { output_text?: unknown }).output_text;
  if (typeof outputText === "string" && outputText.trim()) return outputText.trim();

  const output = (data as { output?: unknown }).output;
  if (!Array.isArray(output)) return null;
  const chunks: string[] = [];
  for (const item of output) {
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      const text = (part as { text?: unknown }).text;
      if (typeof text === "string") chunks.push(text);
    }
  }
  return chunks.join("").trim() || null;
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const messages = parsed.data.messages.slice(-8);
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({
      answer: localAssistantFallback(lastUserMessage),
      fallback: true,
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_ASSISTANT_MODEL ?? "gpt-4.1-mini",
        instructions: buildAssistantSystemPrompt(),
        input: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        max_output_tokens: 520,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      console.error("[assistant]", data);
      return NextResponse.json({
        answer: localAssistantFallback(lastUserMessage),
        fallback: true,
      });
    }

    return NextResponse.json({
      answer: extractResponseText(data) ?? localAssistantFallback(lastUserMessage),
    });
  } catch (error) {
    console.error("[assistant]", error);
    return NextResponse.json({
      answer: localAssistantFallback(lastUserMessage),
      fallback: true,
    });
  }
}
