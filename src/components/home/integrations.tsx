import { SectionHeading } from "@/components/visuals/section-heading";

const integrations = [
  { name: "Google Calendar", glyph: "📅", desc: "Managed availability sync" },
  { name: "Aroha Bookings", glyph: "🗓️", desc: "Rules, buffers, reminders" },
  { name: "Telnyx", glyph: "📞", desc: "Carrier-grade phone numbers" },
  { name: "Stripe", glyph: "💳", desc: "Billing & invoices" },
  { name: "HubSpot", glyph: "🔗", desc: "CRM bidirectional sync" },
  { name: "Zapier", glyph: "⚡", desc: "5,000+ tools, no code" },
  { name: "Slack", glyph: "💬", desc: "Real-time call alerts" },
  { name: "Make", glyph: "🛠️", desc: "Custom automations" },
];

export function Integrations() {
  return (
    <section className="relative py-24">
      <div className="container-tight">
        <SectionHeading
          eyebrow="Plays nicely with everything"
          title={<>Connects to the tools you already love.</>}
          description="Aroha drops into your workflow. Google Calendar, CRM, billing, comms — managed for you, no manual data entry."
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {integrations.map((i) => (
            <div
              key={i.name}
              className="group rounded-2xl border border-border bg-card/50 p-5 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-lg">
                  {i.glyph}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{i.name}</p>
                  <p className="text-xs text-muted-foreground">{i.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
