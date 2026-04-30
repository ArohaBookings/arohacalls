export function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <div className="absolute left-[12%] top-[18%] h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
      <div
        className="absolute right-[8%] top-[10%] h-96 w-96 rounded-full bg-secondary/15 blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1.4s" }}
      />
      <div
        className="absolute left-[40%] bottom-[8%] h-80 w-80 rounded-full bg-accent/15 blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2.8s" }}
      />
    </div>
  );
}
