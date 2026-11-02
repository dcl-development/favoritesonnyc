// Opening hours: one source of truth. Danny edits them in Sanity ("Opening hours"):
// weekly hours plus special dates. Everything on the site (visit list, footer, 404,
// status line, meta, JSON-LD) is derived here, in America/New_York time.

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

/** A date-specific override. `date` is "YYYY-MM-DD" (New York calendar day). */
export type SpecialDate = DayHours & { date: string; note?: string };

export type Hours = { days: Record<DayKey, DayHours>; special: SpecialDate[] };

const FALLBACK_DAY: DayHours = { closed: false, opens: "16:00", closes: "21:00" };

export const DEFAULT_HOURS: Hours = {
  days: Object.fromEntries(DAY_KEYS.map((day) => [day, FALLBACK_DAY])) as Record<
    DayKey,
    DayHours
  >,
  special: [],
};

const TIME = /^([01]\d|2[0-4]):([0-5]\d)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function toMinutes(time: string) {
  const match = TIME.exec(time);
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

type RawDay = { closed?: boolean | null; opens?: string | null; closes?: string | null } | null;
type RawSpecial = (NonNullable<RawDay> & { date?: string | null; note?: string | null }) | null;
export type RawHours =
  | (Partial<Record<DayKey, RawDay>> & { specialDates?: RawSpecial[] | null })
  | null;

function cleanDay(value: RawDay | undefined): DayHours | null {
  if (value?.closed) return { closed: true, opens: "", closes: "" };
  const opens = value?.opens ?? "";
  const closes = value?.closes ?? "";
  if (toMinutes(opens) < toMinutes(closes)) return { closed: false, opens, closes };
  return null;
}

/** Turn the Sanity document into clean hours. Missing or broken weekly days fall back to 4–9. */
export function normalizeHours(raw: RawHours | undefined): Hours {
  if (!raw) return DEFAULT_HOURS;
  const days = {} as Record<DayKey, DayHours>;
  let any = false;
  for (const day of DAY_KEYS) {
    const clean = cleanDay(raw[day]);
    if (clean) any = true;
    days[day] = clean ?? FALLBACK_DAY;
  }

  const seen = new Set<string>();
  const special: SpecialDate[] = [];
  for (const entry of raw.specialDates ?? []) {
    const date = entry?.date ?? "";
    if (!DATE.test(date) || seen.has(date)) continue;
    const clean = cleanDay(entry);
    if (!clean) continue;
    seen.add(date);
    const note = entry?.note?.trim();
    special.push({ ...clean, date, ...(note ? { note } : {}) });
  }
  special.sort((a, b) => a.date.localeCompare(b.date));

  if (!any && !special.length) return DEFAULT_HOURS;
  return { days, special };
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

/* ---------- calendar helpers (New York) ---------- */

export type NyNow = { date: string; minutes: number };

export function nyNow(now = new Date()): NyNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    date: `${read("year")}-${read("month")}-${read("day")}`,
    minutes: Number(read("hour")) * 60 + Number(read("minute")),
  };
}

function utcDate(date: string) {
  return new Date(`${date}T12:00:00Z`);
}

export function addDays(date: string, days: number) {
  const d = utcDate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekdayKey(date: string): DayKey {
  // getUTCDay: 0 = sunday
  return DAY_KEYS[(utcDate(date).getUTCDay() + 6) % 7];
}

/** "thu nov 26" */
export function shortDate(date: string) {
  const d = utcDate(date);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
  const month = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  return `${weekday} ${month} ${d.getUTCDate()}`.toLowerCase();
}

function shortWeekday(date: string) {
  return utcDate(date).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).toLowerCase();
}

/** The hours that apply on a given New York date: a special date wins over the weekly hours. */
export function hoursOn(hours: Hours, date: string): DayHours & { special?: SpecialDate } {
  const special = hours.special.find((entry) => entry.date === date);
  if (special) return { ...special, special };
  return hours.days[weekdayKey(date)];
}

/** Special dates from today on (past dates drop off automatically). */
export function upcomingSpecials(hours: Hours, today: string) {
  return hours.special.filter((entry) => entry.date >= today);
}

/* ---------- weekly summaries ---------- */

/** Rows for the visit page, monday first. */
export function hoursRows(hours: Hours) {
  return DAY_KEYS.map((day) => ({ day, hours: rangeLabel(hours.days[day]) }));
}

/** Rows for upcoming special dates on the visit page. */
export function specialRows(hours: Hours, today = nyNow().date) {
  return upcomingSpecials(hours, today).map((entry) => ({
    date: entry.date,
    day: shortDate(entry.date),
    hours: rangeLabel(entry),
    note: entry.note,
  }));
}

type Group = { start: number; end: number; label: string };

/** Group consecutive days with the same hours, wrapping sunday→monday. */
function groups(hours: Hours): Group[] {
  const labels = DAY_KEYS.map((day) => rangeLabel(hours.days[day]));
  if (labels.every((label) => label === labels[0])) {
    return [{ start: 0, end: 6, label: labels[0] }];
  }
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

/** Footer / 404 line, always generated: "every day · 4–9" or "wednesday–monday · 5–10 · closed tuesday". */
export function hoursLabel(hours: Hours) {
  const all = groups(hours);
  if (all.length === 1 && all[0].label === "closed") return "closed";
  const open = all.filter((g) => g.label !== "closed").map((g) => `${span(g)} · ${g.label}`);
  const closed = all.filter((g) => g.label === "closed").map((g) => `closed ${span(g)}`);
  return [...open, ...closed].join(" · ");
}

/** Status-line text before the clock is read, e.g. "every day, 4–9". */
export function hoursShort(hours: Hours) {
  const { open, closed } = parts(hours);
  return open.length ? open.join("; ") : closed.join("; ");
}

const capitalize = (text: string) =>
  text.replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|closed)\b/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1),
  );

/** Sentence for meta descriptions, e.g. "Open every day, 4–9." (weekly hours only). */
export function hoursSentence(hours: Hours) {
  const { open, closed } = parts(hours);
  if (!open.length) return "Temporarily closed.";
  const first =
    open.length === 1 && open[0].startsWith("every day")
      ? `Open ${open[0]}`
      : open.map(capitalize).join("; ");
  const tail = closed.length ? ` ${closed.map(capitalize).join(". ")}.` : "";
  return `${first}.${tail}`;
}

/* ---------- schema.org ---------- */

const SCHEMA_DAYS: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** schema.org openingHoursSpecification, one entry per distinct set of weekly hours. */
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

/** schema.org specialOpeningHoursSpecification for upcoming special dates. Closed = 00:00–00:00. */
export function specialOpeningHoursSpecification(hours: Hours, today = nyNow().date) {
  return upcomingSpecials(hours, today).map((entry) => ({
    "@type": "OpeningHoursSpecification",
    opens: entry.closed ? "00:00" : entry.opens,
    closes: entry.closed ? "00:00" : entry.closes === "24:00" ? "23:59" : entry.closes,
    validFrom: entry.date,
    validThrough: entry.date,
  }));
}

/* ---------- live status (sticky bar + home sign) ---------- */

export type ServiceStatus = {
  /** "open until 9", "opens at 4", "opens tomorrow at 4", "opens fri at 4" */
  status: string;
  /** Nearest special date in the next 7 days, e.g. "closed thu nov 26 · thanksgiving". */
  notice?: string;
};

const NOTICE_DAYS = 7;

function noticeFor(entry: SpecialDate, today: string) {
  const when = entry.date === today ? "today" : entry.date === addDays(today, 1) ? "tomorrow" : shortDate(entry.date);
  const head = entry.closed ? `closed ${when}` : `${when} · ${rangeLabel(entry)}`;
  return entry.note ? `${head} · ${entry.note}` : head;
}

export function serviceStatus(hours: Hours, now = new Date()): ServiceStatus {
  const { date: today, minutes } = nyNow(now);
  const day = hoursOn(hours, today);

  const upcoming = upcomingSpecials(hours, today).find(
    (entry) =>
      entry.date <= addDays(today, NOTICE_DAYS) &&
      // today's special hours are over once it closes
      !(entry.date === today && !entry.closed && minutes >= toMinutes(entry.closes)),
  );
  const notice = upcoming ? noticeFor(upcoming, today) : undefined;

  if (!day.closed) {
    const opens = toMinutes(day.opens);
    const closes = toMinutes(day.closes);
    if (minutes >= opens && minutes < closes) {
      return { status: `open until ${openLabel(day.closes)}`, notice };
    }
    if (minutes < opens) {
      return { status: `opens at ${openLabel(day.opens)}`, notice };
    }
  }

  for (let ahead = 1; ahead <= 60; ahead += 1) {
    const date = addDays(today, ahead);
    const next = hoursOn(hours, date);
    if (next.closed) continue;
    const when = ahead === 1 ? "tomorrow" : ahead < 7 ? shortWeekday(date) : shortDate(date);
    return { status: `opens ${when} at ${openLabel(next.opens)}`, notice };
  }

  return { status: "closed for now", notice };
}
