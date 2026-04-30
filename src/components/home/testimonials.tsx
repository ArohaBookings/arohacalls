import { Star } from "lucide-react";
import { SectionHeading } from "@/components/visuals/section-heading";
import { Marquee } from "@/components/visuals/marquee";

const testimonials = [
  {
    name: "Liam R.",
    role: "Owner, Trades",
    body: "Helps us keep up with calls while we're out on site. We'd be losing jobs without it.",
  },
  {
    name: "Sophie K.",
    role: "Salon owner",
    body: "Set-up was quick and the AI sounds like a real Kiwi. Clients love that someone always answers.",
  },
  {
    name: "Daniel M.",
    role: "Trades business owner",
    body: "Quotes just appear in the calendar. It's freed up a stupid amount of admin time.",
  },
  {
    name: "Chloe L.",
    role: "Clinic manager",
    body: "Easy to tweak, easy to use, and it's already turned missed calls into new clients.",
  },
  {
    name: "Tama W.",
    role: "Auto workshop",
    body: "Customers reckon they're talking to my receptionist. They've got no idea it's AI.",
  },
  {
    name: "Mia P.",
    role: "Real estate",
    body: "Inquiries come in 24/7 now. Aroha books the viewing and tells me about the lead in one tap.",
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <figure className="w-[340px] shrink-0 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md">
      <div className="flex items-center gap-1 text-amber-300">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-4 text-sm text-foreground/90">&ldquo;{t.body}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <div
          className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-primary-foreground"
          style={{
            background: "linear-gradient(135deg, hsl(162 88% 50%), hsl(261 83% 70%))",
          }}
        >
          {t.name
            .split(" ")
            .map((s) => s[0])
            .join("")}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="container-tight">
        <SectionHeading
          eyebrow="Loved by Kiwi & Yankee businesses"
          title={<>Don&apos;t take our word for it.</>}
          description="From sole-trade sparkies to multi-location clinics — Aroha is the receptionist they wish they hired five years ago."
        />
      </div>
      <div className="relative mt-14 mask-fade-edges">
        <Marquee className="[--duration:55s]" pauseOnHover>
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee className="mt-4 [--duration:65s]" reverse pauseOnHover>
          {[...testimonials].reverse().map((t) => (
            <TestimonialCard key={`r-${t.name}`} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
