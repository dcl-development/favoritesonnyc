import { defineArrayMember, defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons/Clock";
import { DayHoursField, DayHoursInput, HoursDocumentInput, SpecialDateInput } from "../components/DayHoursInput";
import { TIME_OPTIONS } from "./hoursOptions";

const DAYS = [
  ["monday", "Monday"],
  ["tuesday", "Tuesday"],
  ["wednesday", "Wednesday"],
  ["thursday", "Thursday"],
  ["friday", "Friday"],
  ["saturday", "Saturday"],
  ["sunday", "Sunday"],
] as const;

const WEEKLY_REMINDER = "Google, Toast and other listings don’t change from here. Update them too.";
const SPECIAL_REMINDER =
  "Also block these days in Toast so nobody can book, and add them to Google as special hours.";

type Day = { closed?: boolean; opens?: string; closes?: string };
type Special = Day & { _key?: string; date?: string; until?: string; note?: string };

function checkTimes(value: Day | undefined) {
  if (!value || value.closed) return true;
  if (!value.opens || !value.closes) return "Pick an opening and a closing time, or turn on Closed.";
  if (value.closes <= value.opens) return "Closing time has to be after opening time.";
  return true;
}

const timeFields = [
  defineField({ name: "closed", title: "Closed", type: "boolean", initialValue: false }),
  defineField({
    name: "opens",
    title: "Opens",
    type: "string",
    options: { list: TIME_OPTIONS },
    hidden: ({ parent }) => Boolean((parent as Day | undefined)?.closed),
  }),
  defineField({
    name: "closes",
    title: "Closes",
    type: "string",
    options: { list: TIME_OPTIONS },
    hidden: ({ parent }) => Boolean((parent as Day | undefined)?.closed),
  }),
];

function dayField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fieldset: "weekly",
    components: { field: DayHoursField, input: DayHoursInput },
    initialValue: { closed: false, opens: "16:00", closes: "21:00" },
    fields: timeFields,
    validation: (rule) => rule.custom((value: Day | undefined) => checkTimes(value)),
  });
}

function prettyDate(date?: string) {
  if (!date) return "Pick a date";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Thu, Nov 26 – Sun, Nov 29, 2026" or "Thu, Nov 26, 2026". */
function prettyRange(date?: string, until?: string) {
  if (!date) return "Pick a date";
  if (!until || until <= date) return prettyDate(date);
  const first = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return `${first} – ${prettyDate(until)}`;
}

function shortTime(time?: string) {
  return TIME_OPTIONS.find((option) => option.value === time)?.title ?? "?";
}

export const hours = defineType({
  name: "hours",
  title: "Opening hours",
  type: "document",
  icon: ClockIcon,
  components: { input: HoursDocumentInput },
  fieldsets: [
    {
      name: "weekly",
      title: "Weekly hours",
      description: `Your usual week. ${WEEKLY_REMINDER}`,
    },
  ],
  fields: [
    ...DAYS.map(([name, title]) => dayField(name, title)),
    defineField({
      name: "specialDates",
      title: "Special dates",
      type: "array",
      description: `Holidays, days off, or different hours. These replace the weekly hours on those days, and drop off the site after they pass. ${SPECIAL_REMINDER}`,
      of: [
        defineArrayMember({
          name: "specialDate",
          title: "Special date",
          type: "object",
          components: { input: SpecialDateInput },
          initialValue: { closed: true },
          fields: [
            defineField({
              name: "date",
              title: "Date",
              type: "date",
              validation: (rule) => rule.required().error("Pick a date."),
            }),
            defineField({
              name: "until",
              title: "Until (optional)",
              type: "date",
              description: "Only for more than one day in a row. Leave empty for a single day.",
            }),
            ...timeFields,
            defineField({
              name: "note",
              title: "Note",
              type: "string",
              validation: (rule) => rule.max(40),
            }),
          ],
          validation: (rule) =>
            rule.custom((value: Special | undefined) => {
              if (!value?.date) return "Pick a date.";
              if (value.until && value.until <= value.date)
                return "“Until” has to be after the first date. Leave it empty for a single day.";
              return checkTimes(value);
            }),
          preview: {
            select: { date: "date", until: "until", closed: "closed", opens: "opens", closes: "closes", note: "note" },
            prepare({ date, until, closed, opens, closes, note }) {
              const when = closed ? "Closed" : `${shortTime(opens)} – ${shortTime(closes)}`;
              return { title: prettyRange(date, until), subtitle: note ? `${when} · ${note}` : when };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((list: Special[] | undefined) => {
          const ranges = (list ?? [])
            .filter((entry) => entry.date)
            .map((entry) => ({
              key: entry._key ?? "",
              from: entry.date as string,
              to: entry.until && entry.until > (entry.date as string) ? entry.until : (entry.date as string),
            }))
            .sort((a, b) => a.from.localeCompare(b.from));
          for (let i = 1; i < ranges.length; i += 1) {
            const before = ranges[i - 1];
            const here = ranges[i];
            if (here.from <= before.to) {
              if (here.from === before.from && here.to === here.from && before.to === before.from) {
                return { message: `${prettyDate(here.from)} is in the list twice. Keep one.`, path: [{ _key: here.key }] };
              }
              return {
                message: `${prettyRange(here.from, here.to === here.from ? undefined : here.to)} overlaps ${prettyRange(before.from, before.to === before.from ? undefined : before.to)}. Each day can only be in the list once.`,
                path: [{ _key: here.key }],
              };
            }
          }
          return true;
        }),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Opening hours", subtitle: "Weekly hours and special dates." };
    },
  },
});
