"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
};

export function SmartForm({
  endpoint,
  fields,
  submitLabel,
  successMessage,
}: {
  endpoint: string;
  fields: Field[];
  submitLabel: string;
  successMessage: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      form.reset();
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.textarea ? (
            <Textarea
              id={field.name}
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              className="min-h-28"
            />
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {submitLabel}
      </Button>
      {status === "success" && <p className="text-sm text-primary">{successMessage}</p>}
      {status === "error" && (
        <p className="text-sm text-destructive">Something went wrong. Email support@arohacalls.com and we will help.</p>
      )}
    </form>
  );
}
