"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BillingInterval } from "@/lib/plans";

type Status = "idle" | "success" | "error";

function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{message}</p>;
}

function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  if (process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED !== "true") return null;

  return (
    <Button type="button" variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl })}>
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
        G
      </span>
      Continue with Google
    </Button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/dashboard";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirect: false,
      });
      if (res?.error) {
        setError("Email or password is incorrect.");
        return;
      }
      window.location.href = from;
    });
  }

  return (
    <div className="space-y-4">
      <GoogleButton callbackUrl={from} />
      {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" ? (
        <div className="relative py-1 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="bg-card px-3">or</span>
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <ErrorMessage message={error} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Sign in
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function SignupForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const interval = (searchParams.get("interval") ?? "month") as BillingInterval;
  const currency = (searchParams.get("currency") ?? "nzd") as "nzd" | "usd";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      };
      const created = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!created.ok) {
        const json = (await created.json().catch(() => ({}))) as { error?: string };
        setError(json.error ?? "Unable to create account.");
        return;
      }

      const signedIn = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });
      if (signedIn?.error) {
        setError("Account created, but sign-in failed. Use the login page to continue.");
        return;
      }

      if (plan) {
        const checkout = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan, interval, currency }),
        });
        const json = (await checkout.json().catch(() => ({}))) as { url?: string; error?: string };
        if (checkout.ok && json.url) {
          window.location.href = json.url;
          return;
        }
        setError(json.error ?? "Account created, but checkout could not start.");
        return;
      }

      window.location.href = "/dashboard/onboarding";
    });
  }

  return (
    <div className="space-y-4">
      <GoogleButton callbackUrl={plan ? `/pricing#${plan}` : "/dashboard/onboarding"} />
      {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" ? (
        <div className="relative py-1 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="bg-card px-3">or</span>
        </div>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </div>
        {plan ? (
          <p className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-xs text-primary">
            Account first, then Stripe checkout for the selected {currency.toUpperCase()} {interval} plan.
          </p>
        ) : null}
        <ErrorMessage message={error} />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Create account
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus("idle");
    startTransition(async () => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(formData.get("email") ?? "") }),
      });
      setStatus(res.ok ? "success" : "error");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Account email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send reset link
      </Button>
      {status === "success" ? (
        <p className="text-sm text-primary">If an account exists, a reset link has been sent.</p>
      ) : null}
      {status === "error" ? <p className="text-sm text-destructive">Unable to request reset.</p> : null}
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus("idle");
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: String(formData.get("password") ?? ""),
        }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error ?? "Reset link is invalid or expired.");
      setStatus("error");
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </div>
      <ErrorMessage message={error} />
      <Button type="submit" className="w-full" disabled={isPending || !token}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Update password
      </Button>
      {status === "success" ? (
        <p className="text-sm text-primary">
          Password updated.{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
          .
        </p>
      ) : null}
      {!token ? <p className="text-sm text-destructive">Missing reset token.</p> : null}
    </form>
  );
}
