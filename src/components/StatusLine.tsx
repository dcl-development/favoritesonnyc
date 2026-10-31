"use client";

import { useEffect, useState } from "react";
import { serviceStatus } from "@/lib/hours";

export function StatusLine({
  variant = "live",
}: {
  variant?: "live" | "quiet";
}) {
  const [label, setLabel] = useState("every day, 4–9");

  useEffect(() => {
    const update = () => {
      const status = serviceStatus();
      setLabel(variant === "quiet" ? status.quiet : status.live);
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [variant]);

  return <span>{label}</span>;
}
