import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, CreditCard, Home, LifeBuoy, LogOut, Settings, Sparkles, UserCog } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Session } from "next-auth";

const customerNav = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Onboarding", href: "/dashboard/onboarding", icon: Sparkles },
  { label: "Plan", href: "/dashboard/plan", icon: BarChart3 },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function DashboardShell({
  session,
  title,
  description,
  children,
}: {
  session: Session;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-grid opacity-20" />
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container-tight flex min-h-16 items-center justify-between gap-4">
          <Logo href="/dashboard" />
          <div className="flex items-center gap-2">
            {session.user.role === "admin" ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/overview">
                  <UserCog className="h-4 w-4" />
                  Admin
                </Link>
              </Button>
            ) : null}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="container-tight grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-card/55 p-3 backdrop-blur-xl">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{session.user.name ?? "Aroha customer"}</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
            <Badge variant="outline" className="mt-3 capitalize">
              {session.user.role}
            </Badge>
          </div>
          <nav className="mt-2 space-y-1">
            {customerNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-card hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
