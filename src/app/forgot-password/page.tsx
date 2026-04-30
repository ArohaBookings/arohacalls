import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your Aroha Calls account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset your password" description="Enter your account email and we will send a secure reset link.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
