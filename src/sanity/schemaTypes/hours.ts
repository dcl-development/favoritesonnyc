import { defineArrayMember, defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons/Clock";
import { DayHoursField, DayHoursInput, SpecialDateInput } from "../components/DayHoursInput";
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

const GOOGLE_REMINDER =
  "After changing hours here, also update the Google Business Profile by hand (business.google.com). The site can’t change it.";

type Day = { closed?: boolean; opens?: string; closes?: string };
type Special = Day & { _key?: string; date?: string; note?: string };

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

function shortTime(time?: string) {
  return TIME_OPTIONS.find((option) => option.value === time)?.title ?? "?";
}

export const hours = defineType({
  name: "hours",
  title: "Opening hours",
  type: "document",
  icon: ClockIcon,
  fieldsets: [
    {
      name: "weekly",
      title: "Weekly hours",
      description: `The usual week. ${GOOGLE_REMINDER}`,
    },
  ],
  fields: [
    ...DAYS.map(([name, title]) => dayField(name, title)),
    defineField({
      name: "specialDates",
      title: "Special dates",
      type: "array",
      description: `Holidays, days off, or different hours on one date. These replace the weekly hours for that day. Past dates disappear from the site on their own. ${GOOGLE_REMINDER}`,
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
              return checkTimes(value);
            }),
          preview: {
            select: { date: "date", closed: "closed", opens: "opens", closes: "closes", note: "note" },
            prepare({ date, closed, opens, closes, note }) {
              const when = closed ? "Closed" : `${shortTime(opens)} – ${shortTime(closes)}`;
              return { title: prettyDate(date), subtitle: note ? `${when} · ${note}` : when };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.custom((list: Special[] | undefined) => {
          const seen = new Set<string>();
          for (const entry of list ?? []) {
            if (!entry.date) continue;
            if (seen.has(entry.date)) {
              return {
                message: `${prettyDate(entry.date)} is in the list twice. Keep one.`,
                path: [{ _key: entry._key ?? "" }],
              };
            }
            seen.add(entry.date);
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
