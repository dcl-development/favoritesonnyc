import { defineField, defineType } from "sanity";
import { BottleIcon } from "@sanity/icons/Bottle";

const sectionLabels: Record<string, string> = {
  sparkling: "Sparkling",
  white: "White & orange",
  red: "Red",
  sweet: "Sweet",
};

export const wine = defineType({
  name: "wine",
  title: "Wine",
  type: "document",
  icon: BottleIcon,
  fields: [
    defineField({
      name: "status",
      title: "Available tonight?",
      type: "string",
      description:
        "Hidden items stay in Studio and can be turned back on. Delete the document if it's off the list for good.",
      options: {
        list: [
          { title: "Yes — show on the list", value: "on" },
          { title: "No — hide from the list tonight (86'd)", value: "off" },
        ],
        layout: "radio",
      },
      initialValue: "on",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "meta",
      title: "Year, place, grapes",
      type: "string",
      description: "Example: 2023, sicily · 11.5% · catarratto",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Tasting note",
      type: "string",
      description: "Short line under the wine. Example: dry, wild cherry, bracing",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "glass",
      title: "Glass price",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "bottle",
      title: "Bottle price",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "section",
      title: "Which wine list?",
      type: "string",
      options: {
        list: [
          { title: "Sparkling", value: "sparkling" },
          { title: "White & orange", value: "white" },
          { title: "Red", value: "red" },
          { title: "Sweet", value: "sweet" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower number = higher on the list. 0, then 1, then 2…",
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: "List order",
      name: "orderAsc",
      by: [
        { field: "section", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", meta: "meta", section: "section", status: "status" },
    prepare({ title, meta, section, status }) {
      const part = sectionLabels[section] ?? section;
      return {
        title: status === "off" ? `${title} (hidden tonight)` : title,
        subtitle: [part, meta].filter(Boolean).join(" · "),
      };
    },
  },
});
