import { NextResponse } from "next/server";
import { getRetell, selectVoicePreviews, toSafeVoicePreview } from "@/lib/retell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const retell = getRetell();
  if (!retell) {
    return NextResponse.json({ voices: [], configured: false });
  }

  try {
    const voices = await retell.voice.list();
    const safeVoices = voices
      .map(toSafeVoicePreview)
      .filter((voice) => Boolean(voice.previewUrl));

    return NextResponse.json({
      configured: true,
      voices: selectVoicePreviews(safeVoices),
    });
  } catch (error) {
    console.error("[retell voices]", error);
    return NextResponse.json({ voices: [], configured: false }, { status: 200 });
  }
}
