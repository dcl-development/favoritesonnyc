import { defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons/Clock";
import { DayHoursField, DayHoursInput } from "../components/DayHoursInput";
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


type Day = { closed?: boolean; opens?: string; closes?: string };

function dayField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    components: { field: DayHoursField, input: DayHoursInput },
    initialValue: { closed: false, opens: "16:00", closes: "21:00" },
    fields: [
      defineField({
        name: "closed",
        title: "Closed all day",
        type: "boolean",
        initialValue: false,
      }),
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
    ],
    validation: (rule) =>
      rule.custom((value: Day | undefined) => {
        if (!value || value.closed) return true;
        if (!value.opens || !value.closes) return "Pick an opening and a closing time, or tick Closed all day.";
        if (value.closes <= value.opens) return "Closing time has to be after opening time.";
        return true;
      }),
  });
}

export const hours = defineType({
  name: "hours",
  title: "Opening hours",
  type: "document",
  icon: ClockIcon,
  fields: [
    ...DAYS.map(([name, title]) => dayField(name, title)),
    defineField({
      name: "label",
      title: "Short hours line (optional)",
      type: "string",
      description:
        "Leave empty and the site writes it for you, like “every day · 4–9”. Only fill this in for something special, like “closed for the holidays”. It shows in the footer.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Opening hours", subtitle: "Shows on the visit page, footer, and Google." };
    },
  },
});
