import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAssistantSystemPrompt, localAssistantFallback } from "@/lib/assistant-knowledge";
import { db } from "@/lib/db";
import { conversionEvents } from "@/lib/db/schema";
import { hasUsableDatabaseUrl } from "@/lib/safe-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(12),
  sessionId: z.string().max(200).optional(),
  page: z.string().max(500).optional(),
});

function classifyIntent(message: string) {
  const lower = message.toLowerCase();
  if (/(price|pricing|plan|cost|nzd|usd|pay|billing)/.test(lower)) return "pricing";
  if (/(cancel|refund|money back|contract|stripe|invoice)/.test(lower)) return "billing";
  if (/(number|phone|forward|port|call line)/.test(lower)) return "number_setup";
  if (/(calendar|booking|appointment|google)/.test(lower)) return "booking";
  if (/(aroha ai|self serve|self-serve|diy|dashboard|crm|email)/.test(lower)) return "aroha_ai";
  if (/(demo|grace|call|retell|talk)/.test(lower)) return "live_demo";
  if (/(setup|onboarding|start|go live|business)/.test(lower)) return "setup";
  return "general";
}

async function trackAssistantEvent({
  name,
  sessionId,
  metadata,
}: {
  name: string;
  sessionId?: string;
  metadata: Record<string, unknown>;
}) {
  if (!hasUsableDatabaseUrl()) return;
  try {
    await db.insert(conversionEvents).values({ name, sessionId, metadata });
  } catch (error) {
    console.warn("[assistant analytics] skipped", error);
  }
}

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
  const intent = classifyIntent(lastUserMessage);
  await trackAssistantEvent({
    name: "assistant_question_asked",
    sessionId: parsed.data.sessionId,
    metadata: {
      intent,
      page: parsed.data.page,
      messageLength: lastUserMessage.length,
    },
  });
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const answer = localAssistantFallback(lastUserMessage);
    await trackAssistantEvent({
      name: "assistant_answered",
      sessionId: parsed.data.sessionId,
      metadata: { intent, page: parsed.data.page, fallback: true, answerLength: answer.length },
    });
    return NextResponse.json({
      answer,
      fallback: true,
      intent,
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
      const answer = localAssistantFallback(lastUserMessage);
      await trackAssistantEvent({
        name: "assistant_answered",
        sessionId: parsed.data.sessionId,
        metadata: { intent, page: parsed.data.page, fallback: true, answerLength: answer.length },
      });
      return NextResponse.json({
        answer,
        fallback: true,
        intent,
      });
    }

    const answer = extractResponseText(data) ?? localAssistantFallback(lastUserMessage);
    const fallback = !extractResponseText(data);
    await trackAssistantEvent({
      name: "assistant_answered",
      sessionId: parsed.data.sessionId,
      metadata: { intent, page: parsed.data.page, fallback, answerLength: answer.length },
    });
    return NextResponse.json({
      answer,
      fallback,
      intent,
    });
  } catch (error) {
    console.error("[assistant]", error);
    const answer = localAssistantFallback(lastUserMessage);
    await trackAssistantEvent({
      name: "assistant_answered",
      sessionId: parsed.data.sessionId,
      metadata: { intent, page: parsed.data.page, fallback: true, answerLength: answer.length },
    });
    return NextResponse.json({
      answer,
      fallback: true,
      intent,
    });
  }
}
