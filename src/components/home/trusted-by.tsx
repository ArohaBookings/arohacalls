import { siteConfig } from "@/lib/site-config";
import { Marquee } from "@/components/visuals/marquee";

const industries = [
  { name: "Salons", glyph: "✂️" },
  { name: "Real Estate", glyph: "🏡" },
  { name: "Clinics", glyph: "🩺" },
  { name: "Gyms", glyph: "🏋️" },
  { name: "Tradies", glyph: "🔧" },
  { name: "Auto", glyph: "🚗" },
  { name: "Cafes", glyph: "☕" },
  { name: "Spas", glyph: "🌿" },
  { name: "Vets", glyph: "🐾" },
];

export function TrustedBy() {
  return (
    <section className="relative border-y border-border/60 bg-card/20 py-16 sm:py-20">
      <div className="container-tight">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by businesses across {siteConfig.industries.length}+ industries
        </p>
        <div className="relative mt-8 mask-fade-edges">
          <Marquee className="[--duration:55s]" pauseOnHover>
            {industries.concat(industries).map((it, i) => (
              <div
                key={`${it.name}-${i}`}
                className="flex items-center gap-3 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground/85 backdrop-blur-md"
              >
                <span className="text-base">{it.glyph}</span>
                {it.name}
              </div>
            ))}
          </Marquee>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-border bg-card/40 p-7 text-center">
            <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">24/7</div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Live demo available</p>
          </div>
          <div className="rounded-[1.5rem] border border-primary/30 bg-primary/[0.04] p-7 text-center shadow-[0_0_64px_-32px_hsl(var(--primary)/0.5)]">
            <div className="text-3xl font-semibold tracking-tight aurora-text sm:text-4xl">Christchurch</div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Built in New Zealand</p>
          </div>
          <div className="rounded-[1.5rem] border border-border bg-card/40 p-7 text-center">
            <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">7 days</div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Money-back guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
}
