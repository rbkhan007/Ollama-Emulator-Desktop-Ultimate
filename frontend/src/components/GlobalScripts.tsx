"use client";

import { useEffect } from "react";

export default function GlobalScripts() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const suppressKnownErrors = (e: ErrorEvent | PromiseRejectionEvent) => {
      const message = (("reason" in e ? e.reason : (e as ErrorEvent).error) || "").toString();
      if (message.includes("listener indicated") || message.includes("message channel closed")) {
        e.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", suppressKnownErrors);
    window.addEventListener("error", suppressKnownErrors as EventListener);

    return () => {
      window.removeEventListener("unhandledrejection", suppressKnownErrors);
      window.removeEventListener("error", suppressKnownErrors as EventListener);
    };
  }, []);

  return null;
}
