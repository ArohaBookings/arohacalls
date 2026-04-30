import type { ReactNode } from "react";
import Link from "next/link";
import { BarChart3, BookOpen, CreditCard, Download, Home, Settings, ShoppingBag, Users } from "lucide-react";
import { signOut } from "@/lib/auth";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import type { Session } from "next-auth";

const adminNav = [
  { label: "Overview", href: "/admin/overview", icon: Home },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Revenue", href: "/admin/revenue", icon: CreditCard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

export function AdminShell({
  session,
  title,
  description,
  actions,
  children,
}: {
  session: Session;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-grid opacity-20" />
      <div className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="container-tight flex min-h-16 items-center justify-between gap-4">
          <Link href="/admin/overview">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Customer view</Link>
            </Button>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="container-tight grid gap-8 py-8 xl:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-card/55 p-3 backdrop-blur-xl">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">Leo admin</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <nav className="mt-2 space-y-1">
            {adminNav.map((item) => {
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
          <Button asChild variant="outline" className="mt-3 w-full">
            <Link href="/api/admin/orders/export">
              <Download className="h-4 w-4" />
              Export orders
            </Link>
          </Button>
        </aside>
        <main>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
