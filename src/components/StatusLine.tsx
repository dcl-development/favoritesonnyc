"use client";

import { useEffect, useState } from "react";
import { hoursShort, keepTogether, serviceStatus, type ServiceStatus } from "@/lib/hours";
import { useHours } from "./HoursProvider";

/** Live status from the hours, refreshed every minute (New York time). */
export function useServiceStatus(): ServiceStatus {
  const hours = useHours();
  const [status, setStatus] = useState<ServiceStatus>(() => ({ status: hoursShort(hours) }));

  useEffect(() => {
    const update = () => setStatus(serviceStatus(hours));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [hours]);

  return status;
}

/** "open until 9", "opens fri at 4". Used by the sticky bar and the home sign. Never shows the notice. */
export function StatusLine() {
  return <span>{keepTogether(useServiceStatus().status)}</span>;
}
