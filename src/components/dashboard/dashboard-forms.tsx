"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProfileDefaults = {
  businessName?: string | null;
  niche?: string | null;
  phoneNumber?: string | null;
  website?: string | null;
  calendarConnected?: boolean | null;
  notes?: string | null;
};

type UserDefaults = {
  name?: string | null;
  email?: string | null;
};

export function OnboardingForm({ defaults }: { defaults?: ProfileDefaults }) {
  const [calendarConnected, setCalendarConnected] = useState(!!defaults?.calendarConnected);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setDone(false);
    setError(false);
    startTransition(async () => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: String(formData.get("businessName") ?? ""),
          niche: String(formData.get("niche") ?? ""),
          phoneNumber: String(formData.get("phoneNumber") ?? ""),
          website: String(formData.get("website") ?? ""),
          notes: String(formData.get("notes") ?? ""),
          calendarConnected,
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
          <Label htmlFor="businessName">Business name</Label>
          <Input id="businessName" name="businessName" defaultValue={defaults?.businessName ?? ""} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="niche">Niche</Label>
          <Input id="niche" name="niche" defaultValue={defaults?.niche ?? ""} placeholder="Salon, clinic, tradie..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input id="phoneNumber" name="phoneNumber" defaultValue={defaults?.phoneNumber ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" defaultValue={defaults?.website ?? ""} placeholder="https://" />
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-4">
        <Checkbox id="calendarConnected" checked={calendarConnected} onCheckedChange={(value) => setCalendarConnected(value === true)} />
        <div className="space-y-1">
          <Label htmlFor="calendarConnected">Google Calendar is ready to connect</Label>
          <p className="text-xs leading-5 text-muted-foreground">
            Leo will confirm the final calendar connection during setup if you have not already granted access.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">What Leo needs to know</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaults?.notes ?? ""}
          className="min-h-36"
          placeholder="Opening hours, booking rules, services, emergency calls, VIP customers, tone of voice..."
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Save onboarding
      </Button>
      {done ? <p className="text-sm text-primary">Saved. Leo has been notified and will be in touch within 24 hours.</p> : null}
      {error ? <p className="text-sm text-destructive">Could not save onboarding. Try again or email support.</p> : null}
    </form>
  );
}

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
