import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Aroha Calls account and continue to Stripe checkout.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Start your managed AI receptionist"
      description="Create your account first, continue to Stripe checkout, then finish onboarding so Aroha AI can create your managed workspace."
    >
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
