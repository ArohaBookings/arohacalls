"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId() {
  const key = "aroha_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const sessionId = getSessionId();
    const query = window.location.search.replace(/^\?/, "");
    const path = query ? `${pathname}?${query}` : pathname;
    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || undefined,
        sessionId,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
