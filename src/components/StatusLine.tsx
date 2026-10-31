"use client";

import { useEffect, useState } from "react";
import { hoursShort, serviceStatus } from "@/lib/hours";
import { useHours } from "./HoursProvider";

export function StatusLine({
  variant = "live",
}: {
  variant?: "live" | "quiet";
}) {
  const hours = useHours();
  const [label, setLabel] = useState(() => hoursShort(hours));

  useEffect(() => {
    const update = () => {
      const status = serviceStatus(hours);
      setLabel(variant === "quiet" ? status.quiet : status.live);
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [variant, hours]);

  return <span>{label}</span>;
}
