// Google Business Profile hours. Turns our Hours (Sanity "Opening hours") into the body of a
// Business Information API v1 `locations.patch` call, updateMask "regularHours,specialHours".
// Pure: no network, no credentials. The preview route shows exactly what would be sent.

import { DAY_KEYS, addDays, upcomingSpecials, type DayHours, type DayKey, type Hours } from "./hours";

type TimeOfDay = { hours: number; minutes: number };
type DateParts = { year: number; month: number; day: number };

type Period = {
  openDay: string;
  openTime: TimeOfDay;
  closeDay: string;
  closeTime: TimeOfDay;
};

type SpecialPeriod =
  | { startDate: DateParts; closed: true }
  | { startDate: DateParts; endDate: DateParts; openTime: TimeOfDay; closeTime: TimeOfDay };

export type GbpHoursPatch = {
  updateMask: "regularHours,specialHours";
  location: {
    regularHours: { periods: Period[] };
    specialHours: { specialHourPeriods: SpecialPeriod[] };
  };
};

const GBP_DAY: Record<DayKey, string> = {
  monday: "MONDAY",
  tuesday: "TUESDAY",
  wednesday: "WEDNESDAY",
  thursday: "THURSDAY",
  friday: "FRIDAY",
  saturday: "SATURDAY",
  sunday: "SUNDAY",
};

function timeOfDay(time: string): TimeOfDay {
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

function dateParts(date: string): DateParts {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

function periodFor(day: DayKey, hours: DayHours): Period[] {
  if (hours.closed) return [];
  return [
    {
      openDay: GBP_DAY[day],
      openTime: timeOfDay(hours.opens),
      closeDay: GBP_DAY[day],
      closeTime: timeOfDay(hours.closes),
    },
  ];
}

/**
 * Weekly hours plus upcoming special dates. Google wants special hours one day at a time
 * (each period must be under 24 hours), so a range like Dec 24 – Dec 26 becomes three
 * entries. A closed day is just `closed: true`. Notes aren't sent: Google has no field for them.
 * Weekly days that are closed are left out, which is how Google marks a closed day.
 */
export function toGbpHours(hours: Hours, today: string): GbpHoursPatch {
  const periods = DAY_KEYS.flatMap((day) => periodFor(day, hours.days[day]));

  const specialHourPeriods: SpecialPeriod[] = [];
  for (const entry of upcomingSpecials(hours, today)) {
    for (let date = entry.date < today ? today : entry.date; date <= entry.until; date = addDays(date, 1)) {
      specialHourPeriods.push(
        entry.closed
          ? { startDate: dateParts(date), closed: true }
          : {
              startDate: dateParts(date),
              endDate: dateParts(date),
              openTime: timeOfDay(entry.opens),
              closeTime: timeOfDay(entry.closes),
            },
      );
    }
  }

  return {
    updateMask: "regularHours,specialHours",
    location: {
      regularHours: { periods },
      specialHours: { specialHourPeriods },
    },
  };
}
