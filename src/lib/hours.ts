// Opening hours: one source of truth. Danny edits them in Sanity ("Opening hours");
// everything on the site (visit list, footer, 404, status line, meta, JSON-LD) is derived here.

export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export type DayHours = { closed: boolean; opens: string; closes: string };

export type Hours = { days: Record<DayKey, DayHours>; label?: string };

const FALLBACK_DAY: DayHours = { closed: false, opens: "16:00", closes: "21:00" };

export const DEFAULT_HOURS: Hours = {
  days: Object.fromEntries(DAY_KEYS.map((day) => [day, FALLBACK_DAY])) as Record<
    DayKey,
    DayHours
  >,
};

const TIME = /^([01]\d|2[0-4]):([0-5]\d)$/;

function toMinutes(time: string) {
  const match = TIME.exec(time);
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

type RawDay = { closed?: boolean | null; opens?: string | null; closes?: string | null } | null;
export type RawHours = (Partial<Record<DayKey, RawDay>> & { label?: string | null }) | null;

/** Turn the Sanity document into clean hours. Anything missing or broken falls back to 4–9. */
export function normalizeHours(raw: RawHours | undefined): Hours {
  if (!raw) return DEFAULT_HOURS;
  const days = {} as Record<DayKey, DayHours>;
  let any = false;
  for (const day of DAY_KEYS) {
    const value = raw[day];
    if (value?.closed) {
      days[day] = { closed: true, opens: "", closes: "" };
      any = true;
      continue;
    }
    const opens = value?.opens ?? "";
    const closes = value?.closes ?? "";
    if (toMinutes(opens) < toMinutes(closes)) {
      days[day] = { closed: false, opens, closes };
      any = true;
    } else {
      days[day] = FALLBACK_DAY;
    }
  }
  if (!any) return DEFAULT_HOURS;
  const label = raw.label?.trim();
  return { days, label: label || undefined };
}

/** "16:00" -> "4", "16:30" -> "4:30", "11:00" -> "11am" when withSuffix. */
function clock(time: string, withSuffix: boolean) {
  const minutes = toMinutes(time);
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const base = m ? `${h12}:${String(m).padStart(2, "0")}` : `${h12}`;
  if (!withSuffix) return base;
  return `${base}${h24 < 12 ? "am" : "pm"}`;
}

/** "4–9" for evening hours, "11am–9pm" when a day starts before noon. */
export function rangeLabel(day: DayHours) {
  if (day.closed) return "closed";
  const morning = toMinutes(day.opens) < 12 * 60;
  return `${clock(day.opens, morning)}–${clock(day.closes, morning)}`;
}

export function openLabel(time: string) {
  return clock(time, toMinutes(time) < 12 * 60);
}

/** Rows for the visit page, monday first. */
export function hoursRows(hours: Hours) {
  return DAY_KEYS.map((day) => ({ day, hours: rangeLabel(hours.days[day]) }));
}

type Group = { start: number; end: number; label: string };

/** Group consecutive days with the same hours, wrapping sunday→monday. */
function groups(hours: Hours): Group[] {
  const labels = DAY_KEYS.map((day) => rangeLabel(hours.days[day]));
  if (labels.every((label) => label === labels[0])) {
    return [{ start: 0, end: 6, label: labels[0] }];
  }
  // start at a day whose label differs from the day before, so runs don't split across the wrap
  const offset = labels.findIndex((label, i) => label !== labels[(i + 6) % 7]);
  const result: Group[] = [];
  for (let k = 0; k < 7; k += 1) {
    const i = (offset + k) % 7;
    const last = result[result.length - 1];
    if (last && last.label === labels[i]) last.end = i;
    else result.push({ start: i, end: i, label: labels[i] });
  }
  return result;
}

function span(group: Group) {
  if (group.start === group.end) return DAY_KEYS[group.start];
  if ((group.end + 1) % 7 === group.start) return "every day";
  return `${DAY_KEYS[group.start]}–${DAY_KEYS[group.end]}`;
}

function parts(hours: Hours) {
  const all = groups(hours);
  const open = all.filter((g) => g.label !== "closed").map((g) => `${span(g)}, ${g.label}`);
  const closed = all.filter((g) => g.label === "closed").map((g) => `closed ${span(g)}`);
  return { open, closed };
}

/** Short line for the footer and 404, e.g. "every day · 4–9" or "wednesday–monday · 5–10 · closed tuesday". */
export function hoursLabel(hours: Hours) {
  if (hours.label) return hours.label;
  const all = groups(hours);
  if (all.length === 1 && all[0].label === "closed") return "closed";
  const open = all.filter((g) => g.label !== "closed").map((g) => `${span(g)} · ${g.label}`);
  const closed = all.filter((g) => g.label === "closed").map((g) => `closed ${span(g)}`);
  return [...open, ...closed].join(" · ");
}

/** Status-line fallback, e.g. "every day, 4–9". */
export function hoursShort(hours: Hours) {
  const { open, closed } = parts(hours);
  return open.length ? open.join("; ") : closed.join("; ");
}

const capitalize = (text: string) =>
  text.replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|closed)\b/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1),
  );

/** Sentence for meta descriptions, e.g. "Open every day, 4–9." */
export function hoursSentence(hours: Hours) {
  const { open, closed } = parts(hours);
  if (!open.length) return "Temporarily closed.";
  const first = open.length === 1 && open[0].startsWith("every day") ? `Open ${open[0]}` : open.map(capitalize).join("; ");
  const tail = closed.length ? ` ${closed.map(capitalize).join(". ")}.` : "";
  return `${first}.${tail}`;
}

const SCHEMA_DAYS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** schema.org openingHoursSpecification, one entry per distinct set of hours. */
export function openingHoursSpecification(hours: Hours) {
  const byRange = new Map<string, string[]>();
  for (const day of DAY_KEYS) {
    const value = hours.days[day];
    if (value.closed) continue;
    const key = `${value.opens}|${value.closes}`;
    byRange.set(key, [...(byRange.get(key) ?? []), SCHEMA_DAYS[day]]);
  }
  return [...byRange].map(([key, dayOfWeek]) => {
    const [opens, closes] = key.split("|");
    return { "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes };
  });
}

export type ServiceStatus = {
  live: string;
  quiet: string;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export function serviceStatus(hours: Hours, now = new Date()): ServiceStatus {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    formatted.find((part) => part.type === type)?.value ?? "";

  const index = WEEKDAY_INDEX[read("weekday")] ?? 0;
  const minutes = Number(read("hour")) * 60 + Number(read("minute"));
  const today = hours.days[DAY_KEYS[index]];
  const summary = hoursShort(hours);

  if (!today.closed) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);
    if (minutes >= opens && minutes < closes) {
      return { live: `open until ${openLabel(today.closes)}`, quiet: "walk-ins welcome" };
    }
    if (minutes < opens) {
      return {
        live: `opens at ${openLabel(today.opens)}`,
        quiet: `walk-ins from ${openLabel(today.opens)}`,
      };
    }
  }

  for (let ahead = 1; ahead <= 7; ahead += 1) {
    const next = hours.days[DAY_KEYS[(index + ahead) % 7]];
    if (next.closed) continue;
    const when = ahead === 1 ? "tomorrow" : DAY_KEYS[(index + ahead) % 7];
    const quiet = `opens ${when} at ${openLabel(next.opens)}`;
    // keep the sticky bar short when the week is irregular
    return { live: summary.length > 32 ? quiet : summary, quiet };
  }

  return { live: "closed for now", quiet: "closed for now" };
}
