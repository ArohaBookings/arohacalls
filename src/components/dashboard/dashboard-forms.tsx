"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

type ProfileDefaults = {
  businessName?: string | null;
  niche?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  calendarConnected?: boolean | null;
  notes?: string | null;
  onboardingData?: Record<string, unknown> | null;
};

type UserDefaults = {
  name?: string | null;
  email?: string | null;
};

export function OnboardingForm({ defaults }: { defaults?: ProfileDefaults }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState<"draft" | "submitted" | false>(false);
  const [error, setError] = useState(false);
  const initialData = useMemo(() => {
    const saved = (defaults?.onboardingData ?? {}) as Record<string, unknown>;
    return {
      businessName: defaults?.businessName ?? "",
      niche: defaults?.niche ?? "",
      phoneNumber: defaults?.phoneNumber ?? "",
      website: defaults?.website ?? "",
      calendarConnected: !!defaults?.calendarConnected,
      notes: defaults?.notes ?? "",
      ...saved,
    } as Record<string, string | boolean>;
  }, [defaults]);
  const [data, setData] = useState<Record<string, string | boolean>>(initialData);

  const requiredKeys = ["businessName", "primaryGoal", "callCoverage", "handoffUrgent", "boundaries"];
  const completedRequired = requiredKeys.filter((key) => String(data[key] ?? "").trim()).length;
  const progress = Math.round((completedRequired / requiredKeys.length) * 100);

  function update(key: string, value: string | boolean) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function save(mode: "draft" | "submit") {
    setDone(false);
    setError(false);
    startTransition(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          businessName: String(data.businessName ?? ""),
          niche: String(data.niche ?? ""),
          phoneNumber: String(data.phoneNumber ?? ""),
          website: String(data.website ?? ""),
          notes: String(data.notes ?? ""),
          calendarConnected: data.calendarConnected === true,
          onboardingData: data,
        }),
      });
      setDone(res.ok ? (mode === "submit" ? "submitted" : "draft") : false);
      setError(!res.ok);
    });
  }

  const section = onboardingSections[activeStep];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Managed setup intake</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Build the front office around your real business.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Save as you go. After you submit, these answers go to Aroha AI so your managed organisation,
              receptionist rules, calendar, inbox, CRM, and login invite can be created correctly.
            </p>
          </div>
          <div className="min-w-36">
            <p className="mb-2 text-xs text-muted-foreground">{progress}% core details complete</p>
            <Progress value={progress} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-2">
          {onboardingSections.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left text-sm transition ${
                index === activeStep
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-white/70 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current text-xs font-semibold">
                {index + 1}
              </span>
              <span>
                <span className="block font-medium">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 opacity-80">{item.description}</span>
              </span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            save("submit");
          }}
          className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Step {activeStep + 1} of {onboardingSections.length}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{section.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.description}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}>
                {field.type === "checkbox" ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-slate-50 p-4">
                    <Checkbox
                      id={field.key}
                      checked={data[field.key] === true}
                      onCheckedChange={(value) => update(field.key, value === true)}
                    />
                    <div>
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{field.help}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.key}
                        value={String(data[field.key] ?? "")}
                        onChange={(event) => update(field.key, event.target.value)}
                        className="min-h-28"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={String(data[field.key] ?? "")}
                        onChange={(event) => update(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        type={field.type}
                      />
                    )}
                    {field.help ? <p className="text-xs leading-5 text-muted-foreground">{field.help}</p> : null}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={activeStep === 0} onClick={() => setActiveStep((value) => Math.max(0, value - 1))}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={activeStep === onboardingSections.length - 1}
                onClick={() => setActiveStep((value) => Math.min(onboardingSections.length - 1, value + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={isPending} onClick={() => save("draft")}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save draft
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit setup
              </Button>
            </div>
          </div>
          {done === "draft" ? <p className="mt-4 text-sm text-primary">Draft saved. You can come back and finish anytime.</p> : null}
          {done === "submitted" ? <p className="mt-4 text-sm text-primary">Submitted. Aroha AI now has the setup brief; Aroha Group will review it and send your login when the workspace is ready.</p> : null}
          {error ? <p className="mt-4 text-sm text-destructive">Could not save onboarding. Try again or email support.</p> : null}
        </form>
      </div>
    </div>
  );
}

type OnboardingField = {
  key: string;
  label: string;
  type: "text" | "tel" | "url" | "textarea" | "checkbox";
  placeholder?: string;
  help?: string;
};

type OnboardingSection = {
  id: string;
  title: string;
  description: string;
  fields: OnboardingField[];
};

const onboardingSections: OnboardingSection[] = [
  {
    id: "business",
    title: "Business basics",
    description: "The identity, location, contact details, and channels Aroha should recognise.",
    fields: [
      { key: "businessName", label: "Business name", type: "text", placeholder: "Aroha Plumbing" },
      { key: "niche", label: "Industry / niche", type: "text", placeholder: "Plumber, salon, clinic, gym..." },
      { key: "phoneNumber", label: "Main phone number", type: "tel", placeholder: "+64..." },
      { key: "website", label: "Website", type: "url", placeholder: "https://" },
      { key: "serviceArea", label: "Service area", type: "textarea", placeholder: "Suburbs, cities, regions, countries, in-person vs remote." },
    ],
  },
  {
    id: "goals",
    title: "Goals and pain",
    description: "What must change for Aroha to be worth it.",
    fields: [
      { key: "primaryGoal", label: "Main outcome you want", type: "textarea", placeholder: "More bookings, fewer missed calls, faster quotes, cleaner follow-up..." },
      { key: "missedCallPain", label: "Where calls get missed today", type: "textarea", placeholder: "On tools, after hours, lunch rush, staff busy, multi-location routing..." },
      { key: "bestLeadTypes", label: "Best leads or customers", type: "textarea", placeholder: "High-value jobs, new patients, colour bookings, emergency jobs..." },
      { key: "badFitCalls", label: "Calls Aroha should filter or discourage", type: "textarea", placeholder: "Spam, unsupported suburbs, services you do not offer..." },
    ],
  },
  {
    id: "website",
    title: "Website import",
    description: "Where Aroha should learn public business information from.",
    fields: [
      { key: "websiteImport", label: "Pages Aroha should read", type: "textarea", placeholder: "Services, pricing, FAQ, booking, about, contact..." },
      { key: "sourceOfTruth", label: "What information is most accurate?", type: "textarea", placeholder: "Website, Google Business Profile, price sheet, internal doc..." },
      { key: "brandVoice", label: "Tone of voice", type: "textarea", placeholder: "Warm, direct, premium, casual, Kiwi, professional, calm..." },
    ],
  },
  {
    id: "services",
    title: "Services and offers",
    description: "What Aroha can sell, quote, book, explain, or rule out.",
    fields: [
      { key: "services", label: "Services", type: "textarea", placeholder: "List every service, duration, price range, and who can do it." },
      { key: "pricingRules", label: "Pricing / quote rules", type: "textarea", placeholder: "Fixed prices, callout fees, quote required, no prices over phone..." },
      { key: "upsells", label: "Useful add-ons or upsells", type: "textarea", placeholder: "Maintenance plans, product add-ons, review requests, memberships..." },
      { key: "serviceLimits", label: "Things Aroha must never promise", type: "textarea", placeholder: "Exact diagnosis, guaranteed availability, regulated advice..." },
    ],
  },
  {
    id: "hours",
    title: "Hours and coverage",
    description: "When calls are answered and what changes after hours.",
    fields: [
      { key: "openingHours", label: "Opening hours", type: "textarea", placeholder: "Mon-Fri 8-5, Sat 9-1, closed public holidays..." },
      { key: "callCoverage", label: "Aroha coverage rules", type: "textarea", placeholder: "24/7, after-hours only, overflow only, lunch cover..." },
      { key: "afterHours", label: "After-hours behaviour", type: "textarea", placeholder: "Take message, emergency escalation, next-day callback, booking only..." },
      { key: "holidayRules", label: "Holiday / closure rules", type: "textarea", placeholder: "Public holidays, annual shutdown, staff leave..." },
    ],
  },
  {
    id: "calls",
    title: "Call handling rules",
    description: "How Aroha should qualify, answer, route, and summarise calls.",
    fields: [
      { key: "greeting", label: "Preferred greeting", type: "textarea", placeholder: "Thanks for calling..., how can I help?" },
      { key: "qualificationQuestions", label: "Questions Aroha should ask", type: "textarea", placeholder: "Name, phone, suburb, issue, urgency, preferred time, budget..." },
      { key: "callerMemoryRules", label: "Caller-ID memory rules", type: "textarea", placeholder: "How to greet returning callers and what details to remember." },
      { key: "callSummaryRecipients", label: "Who receives call summaries?", type: "textarea", placeholder: "Owner, manager, bookings inbox, service team..." },
    ],
  },
  {
    id: "booking",
    title: "Booking and calendar",
    description: "Google Calendar setup, staff, services, buffers, and appointment logic.",
    fields: [
      { key: "calendarConnected", label: "Google Calendar is ready to connect", type: "checkbox", help: "Tick this if the calendar you want Aroha to use already exists." },
      { key: "googleCalendarConnectDesired", label: "Connect Google Calendar for bookings", type: "checkbox", help: "Aroha AI can check availability and place bookings into Google Calendar once you approve the connection." },
      { key: "calendarOwner", label: "Who owns the Google Calendar?", type: "text", placeholder: "Business owner, manager, shared calendar..." },
      { key: "googleCalendarAccount", label: "Google Calendar email", type: "text", placeholder: "bookings@yourbusiness.com or owner@gmail.com" },
      { key: "bookingRules", label: "Booking rules", type: "textarea", placeholder: "Durations, buffers, travel time, staff skills, booking windows..." },
      { key: "rescheduleCancelRules", label: "Reschedule / cancellation rules", type: "textarea", placeholder: "How much notice, deposits, no-show rules, emergency exceptions..." },
      { key: "confirmationRules", label: "Confirmation and reminder rules", type: "textarea", placeholder: "Email, SMS, day-before reminders, required details..." },
    ],
  },
  {
    id: "email",
    title: "Email AI",
    description: "How Aroha should help with inbox triage, replies, follow-up, and escalation.",
    fields: [
      { key: "gmailConnectDesired", label: "Connect Gmail or Google Workspace inboxes", type: "checkbox", help: "Tick this if you want Aroha AI to draft replies, summarise threads, and keep email with the customer timeline." },
      { key: "googleSignInPreferred", label: "Use Google sign-in where available", type: "checkbox", help: "Useful if the same Google account manages Calendar, Gmail, and Aroha AI access." },
      { key: "emailInboxes", label: "Inboxes to connect", type: "textarea", placeholder: "info@, bookings@, support@..." },
      { key: "emailCategories", label: "Email categories", type: "textarea", placeholder: "Bookings, quotes, complaints, suppliers, urgent, spam..." },
      { key: "emailApprovalRules", label: "Approval rules", type: "textarea", placeholder: "Auto-draft only, send simple replies, hold complaints for review..." },
      { key: "emailTemplates", label: "Templates or common replies", type: "textarea", placeholder: "Quote received, booking confirmed, waiting list, follow-up..." },
    ],
  },
  {
    id: "messages",
    title: "Messages and follow-up",
    description: "SMS/WhatsApp-style follow-ups, missed-call texts, reminders, and review requests.",
    fields: [
      { key: "messageChannels", label: "Message channels", type: "textarea", placeholder: "SMS, WhatsApp if supported, email follow-up..." },
      { key: "missedCallText", label: "Missed-call text behaviour", type: "textarea", placeholder: "When to text, what to say, who to notify..." },
      { key: "followupRules", label: "Follow-up rules", type: "textarea", placeholder: "Quote chasing, booking reminders, review request timing..." },
      { key: "optOutRules", label: "Opt-out or consent rules", type: "textarea", placeholder: "Words to honour, do-not-contact rules, sensitive customers..." },
    ],
  },
  {
    id: "crm",
    title: "CRM and memory",
    description: "What Aroha should remember and how the customer timeline should be organised.",
    fields: [
      { key: "crmFields", label: "Important customer fields", type: "textarea", placeholder: "Address, service history, pet name, stylist, vehicle, membership..." },
      { key: "vipRules", label: "VIP / repeat customer rules", type: "textarea", placeholder: "How to identify and prioritise important callers." },
      { key: "tags", label: "Tags and lead stages", type: "textarea", placeholder: "New lead, quote sent, booked, urgent, VIP, lost..." },
      { key: "businessCoachGoals", label: "Business Coach insights you want", type: "textarea", placeholder: "Missed opportunities, best lead sources, staff performance, churn risk..." },
    ],
  },
  {
    id: "handoff",
    title: "Handoff and escalation",
    description: "When Aroha should transfer, notify, or stop and ask a human.",
    fields: [
      { key: "handoffUrgent", label: "Urgent escalation rules", type: "textarea", placeholder: "Emergencies, angry customers, VIPs, payment issues, safety..." },
      { key: "transferNumbers", label: "Transfer numbers / contacts", type: "textarea", placeholder: "Owner mobile, manager, after-hours duty phone..." },
      { key: "handoffHours", label: "When live transfer is allowed", type: "textarea", placeholder: "Business hours only, urgent 24/7, never after 9pm..." },
      { key: "fallbackRules", label: "If nobody answers the transfer", type: "textarea", placeholder: "Take message, send SMS, email summary, book callback..." },
    ],
  },
  {
    id: "compliance",
    title: "Compliance and safety",
    description: "Boundaries that protect your business, callers, and Aroha Group.",
    fields: [
      { key: "boundaries", label: "Hard boundaries", type: "textarea", placeholder: "No medical/legal/financial advice, no diagnoses, no guarantees..." },
      { key: "recordingNotice", label: "Recording / AI notice preference", type: "textarea", placeholder: "What callers should be told where required." },
      { key: "sensitiveData", label: "Sensitive information rules", type: "textarea", placeholder: "Health info, payment info, minors, regulated data, deletion requests..." },
      { key: "complaints", label: "Complaint handling", type: "textarea", placeholder: "Who receives complaints and what Aroha should say." },
    ],
  },
  {
    id: "review",
    title: "Review and submit",
    description: "Final notes before the managed setup team moves this into Aroha AI.",
    fields: [
      { key: "launchDate", label: "Ideal launch date", type: "text", placeholder: "ASAP, next Monday, after team training..." },
      { key: "arohaAiLoginRecipient", label: "Who should receive the Aroha AI login invite?", type: "text", placeholder: "Owner, manager, operations inbox..." },
      { key: "successDefinition", label: "What does success look like in 30 days?", type: "textarea", placeholder: "Calls answered, bookings captured, admin time saved, revenue recovered..." },
      { key: "notes", label: "Anything else Aroha Group should know?", type: "textarea", placeholder: "Edge cases, staff preferences, internal policies, examples of good/bad calls..." },
    ],
  },
] as const;

export function SupportForm() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setDone(false);
    setError(false);
    startTransition(async () => {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: String(formData.get("subject") ?? ""),
          message: String(formData.get("message") ?? ""),
        }),
      });
      setDone(res.ok);
      setError(!res.ok);
      if (res.ok) form.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" className="min-h-32" required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send support request
      </Button>
      {done ? <p className="text-sm text-primary">Support request sent. Expected response time: within 1 business day.</p> : null}
      {error ? <p className="text-sm text-destructive">Could not send support request.</p> : null}
    </form>
  );
}

export function SettingsForm({ user, profile }: { user: UserDefaults; profile?: ProfileDefaults }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setDone(false);
    setError(false);
    startTransition(async () => {
      const res = await fetch("/api/settings/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          businessName: String(formData.get("businessName") ?? ""),
          niche: String(formData.get("niche") ?? ""),
          phoneNumber: String(formData.get("phoneNumber") ?? ""),
          website: String(formData.get("website") ?? ""),
        }),
      });
      setDone(res.ok);
      setError(!res.ok);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={user.name ?? ""} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={user.email ?? ""} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input id="businessName" name="businessName" defaultValue={profile?.businessName ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="niche">Niche</Label>
          <Input id="niche" name="niche" defaultValue={profile?.niche ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input id="phoneNumber" name="phoneNumber" defaultValue={profile?.phoneNumber ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" defaultValue={profile?.website ?? ""} />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save settings
      </Button>
      {done ? (
        <p className="flex items-center gap-2 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved.
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">Could not save settings.</p> : null}
    </form>
  );
}
