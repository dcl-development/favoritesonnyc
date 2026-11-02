"use client";

import { useEffect, useState } from "react";
import { hoursShort, keepTogether, serviceStatus, type ServiceStatus } from "@/lib/hours";
import { useHours } from "./HoursProvider";

/**
 * Live line for the sticky bar and the home sign: "open until 9", "opens fri at 4".
 * When a special date is within a week, it takes turns with the notice
 * ("closed thu nov 26 · thanksgiving") every few seconds.
 */
export function StatusLine() {
  const hours = useHours();
  const [status, setStatus] = useState<ServiceStatus>(() => ({ status: hoursShort(hours) }));
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const update = () => setStatus(serviceStatus(hours));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [hours]);

  useEffect(() => {
    if (!status.notice) return;
    const id = window.setInterval(() => setShowNotice((on) => !on), 5_000);
    return () => window.clearInterval(id);
  }, [status.notice]);

  return <span>{keepTogether(showNotice && status.notice ? status.notice : status.status)}</span>;
}
