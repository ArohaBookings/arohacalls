"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.6)] hover:shadow-[0_12px_36px_-6px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/85 hover:-translate-y-0.5",
        outline:
          "border border-border bg-transparent hover:bg-card/60 hover:border-foreground/30",
        ghost: "hover:bg-card/60 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow:
          "bg-foreground text-background shadow-[0_0_0_1px_hsl(var(--foreground)/0.6),0_8px_24px_-8px_hsl(var(--foreground)/0.6)] hover:bg-foreground/90 hover:-translate-y-0.5",
        gradient:
          "relative overflow-hidden bg-[length:200%_200%] bg-gradient-to-br from-primary via-secondary to-accent text-primary-foreground hover:bg-[position:100%_100%] shadow-[0_8px_28px_-6px_hsl(var(--primary)/0.55)] transition-[background-position] duration-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-9 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
