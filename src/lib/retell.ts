import Retell, { verify as verifyRetellWebhook } from "retell-sdk";
import type { VoiceResponse } from "retell-sdk/resources/voice";

let retellInstance: Retell | null = null;

export type SafeVoicePreview = {
  id: string;
  name: string;
  accent: string;
  gender: string;
  provider: string;
  previewUrl?: string;
};

export function getRetellApiKey() {
  return process.env.RETELL_API_KEY ?? "";
}

export function getRetellGraceAgentId() {
  return process.env.RETELL_AGENT_ID_GRACE ?? "";
}

export function getRetell() {
  const apiKey = getRetellApiKey();
  if (!apiKey) return null;
  if (!retellInstance) {
    retellInstance = new Retell({ apiKey });
  }
  return retellInstance;
}

export async function verifyRetellSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const apiKey = getRetellApiKey();
  if (!apiKey) return false;
  return verifyRetellWebhook(rawBody, apiKey, signature);
}

export function safeTranscriptSnippet(transcript?: string | null, maxLength = 900) {
  if (!transcript) return null;
  const compact = transcript.replace(/\s+/g, " ").trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength - 1).trim()}...`;
}

export function inferCallIntent(transcript?: string | null, summary?: string | null) {
  const text = `${transcript ?? ""} ${summary ?? ""}`.toLowerCase();
  if (/(book|appointment|calendar|time|slot|schedule)/.test(text)) return "Booking request";
  if (/(quote|price|cost|estimate|invoice)/.test(text)) return "Quote request";
  if (/(urgent|emergency|leak|broken|no hot water|same day)/.test(text)) return "Urgent service lead";
  if (/(hours|open|location|address|available)/.test(text)) return "Business information";
  if (text.trim()) return "General enquiry";
  return "Analysis pending";
}

export function didBook(transcript?: string | null, summary?: string | null) {
  return /(booked|booking confirmed|appointment booked|scheduled|reserved)/i.test(`${transcript ?? ""} ${summary ?? ""}`);
}

export function didRequestQuote(transcript?: string | null, summary?: string | null) {
  return /(quote|price|cost|estimate)/i.test(`${transcript ?? ""} ${summary ?? ""}`);
}

export function nextActionForCall({
  bookingMade,
  quoteRequested,
  intent,
}: {
  bookingMade: boolean;
  quoteRequested: boolean;
  intent?: string | null;
}) {
  if (bookingMade) return "Send confirmation, keep the customer timeline updated, and let the team know what was booked.";
  if (quoteRequested) return "Send a quote follow-up while the lead is still hot.";
  if (intent === "Urgent service lead") return "Notify the owner immediately and keep the caller reassured.";
  return "Review the summary and decide whether to book, quote, or follow up.";
}

export function toSafeVoicePreview(voice: VoiceResponse): SafeVoicePreview {
  return {
    id: voice.voice_id,
    name: voice.voice_name,
    accent: voice.accent ?? "International",
    gender: voice.gender,
    provider: voice.provider,
    previewUrl: voice.preview_audio_url,
  };
}

export function selectVoicePreviews(voices: SafeVoicePreview[]) {
  const wanted = [
    { id: "nz", label: "New Zealand", match: /(new zealand|nz|kiwi)/i },
    { id: "au", label: "Australian", match: /(australian|aussie)/i },
    { id: "us", label: "American", match: /(american|us)/i },
    { id: "uk", label: "British", match: /(british|english|uk)/i },
  ];

  return wanted.map((item) => {
    const voice = voices.find((candidate) => item.match.test(candidate.accent)) ?? voices.find((candidate) => candidate.previewUrl);
    return {
      accentId: item.id,
      label: item.label,
      voice: voice ?? null,
    };
  });
}
