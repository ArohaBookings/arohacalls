import * as React from "react";
import { cn } from "@/lib/utils";

export function AuroraText({ children, className, as: Tag = "span" }: { children: React.ReactNode; className?: string; as?: keyof React.JSX.IntrinsicElements }) {
  const Comp = Tag as React.ElementType;
  return <Comp className={cn("aurora-text inline-block", className)}>{children}</Comp>;
}
