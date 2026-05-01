import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  withWordmark = true,
}: {
  className?: string;
  href?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3 font-semibold", className)}>
      <span className="relative inline-grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_0_28px_rgba(45,221,213,0.35)]">
        <Image
          src="/aroha-mark.png"
          alt=""
          width={40}
          height={40}
          className="h-full w-full object-cover"
          priority
        />
      </span>
      {withWordmark && (
        <span className="text-xl tracking-tight text-foreground">
          Aroha <span className="text-foreground/72">Calls</span>
        </span>
      )}
    </Link>
  );
}
