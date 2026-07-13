"use client";

import { useEffect, useRef } from "react";

export function JsonLd({ data }: { data: object }) {
  const ref = useRef<HTMLScriptElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = JSON.stringify(data);
    }
  }, [data]);
  return <script ref={ref} type="application/ld+json" />;
}
