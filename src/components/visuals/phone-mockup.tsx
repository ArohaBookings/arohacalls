"use client";

import { motion } from "motion/react";
import { Phone, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { VoiceWave } from "@/components/visuals/voice-wave";

const transcript = [
  { who: "caller", text: "Hi, can I book a haircut for tomorrow afternoon?" },
  { who: "aroha", text: "Of course! I have 2:15pm or 3:30pm with Maya. Which works?" },
  { who: "caller", text: "3:30 please. It's Sarah, my number is on file." },
  { who: "aroha", text: "Booked, Sarah. I've sent a confirmation text. See you at 3:30 ✨" },
];

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] perspective-1000">
      <motion.div
        initial={{ rotate: -3, y: 18, opacity: 0 }}
        animate={{ rotate: -2, y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative aspect-[9/19] rounded-[42px] border border-border bg-card shadow-2xl glow-ring overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, hsl(240 10% 7%) 0%, hsl(240 10% 4%) 60%, hsl(240 10% 6%) 100%)",
        }}
      >
        <div className="absolute left-1/2 top-3 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-black border border-border/60" />
        <div className="relative z-10 flex h-full flex-col p-5 pt-12">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Live</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 -m-2 rounded-full bg-primary/20 animate-ping" />
              <div className="relative grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary border border-primary/30">
                <Phone className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Aroha</p>
              <p className="text-xs text-muted-foreground">Answering for Maya&apos;s Salon</p>
            </div>
          </div>
          <VoiceWave className="mt-5 h-8" bars={28} />
          <div className="mt-5 space-y-2.5 overflow-hidden">
            {transcript.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.4, duration: 0.45 }}
                className={
                  line.who === "aroha"
                    ? "ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/15 border border-primary/20 px-3 py-2 text-xs text-foreground"
                    : "mr-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-card border border-border px-3 py-2 text-xs text-foreground/85"
                }
              >
                {line.text}
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            className="mt-auto rounded-2xl border border-primary/30 bg-primary/10 p-3"
          >
            <div className="flex items-center gap-2 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Booking created
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-foreground/90">
                <Calendar className="h-3.5 w-3.5" /> Tomorrow 3:30 PM · Sarah
              </div>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 18, x: -30, rotate: -8 }}
        animate={{ opacity: 1, y: 0, x: -30, rotate: -6 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -left-6 top-24 z-20 hidden w-56 rounded-2xl border border-border bg-card/90 p-3 shadow-2xl backdrop-blur-sm sm:block"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-secondary/15 text-secondary">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <p className="font-medium text-foreground">AI Summary</p>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Sarah booked a haircut for tomorrow at 3:30. Prefers Maya. Confirmation sent.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 18, x: 30, rotate: 8 }}
        animate={{ opacity: 1, y: 0, x: 30, rotate: 6 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute -right-4 bottom-32 z-20 hidden w-48 rounded-2xl border border-border bg-card/90 p-3 shadow-2xl backdrop-blur-sm sm:block"
      >
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">CRM</p>
        <p className="mt-1 text-xs font-medium text-foreground">Sarah J.</p>
        <p className="text-[11px] text-muted-foreground">5th visit · Loyal · Loves a fade</p>
      </motion.div>
    </div>
  );
}
