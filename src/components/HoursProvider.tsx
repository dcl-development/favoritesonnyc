"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_HOURS, hoursLabel, type Hours } from "@/lib/hours";

const HoursContext = createContext<Hours>(DEFAULT_HOURS);

export function HoursProvider({ hours, children }: { hours: Hours; children: ReactNode }) {
  return <HoursContext.Provider value={hours}>{children}</HoursContext.Provider>;
}

export function useHours() {
  return useContext(HoursContext);
}

/** The short hours line (footer, 404). */
export function HoursLabel() {
  return <>{hoursLabel(useHours())}</>;
}
