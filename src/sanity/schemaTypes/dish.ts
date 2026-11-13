import { defineField, defineType } from "sanity";
import { LemonIcon } from "@sanity/icons/Lemon";

const sectionLabels: Record<string, string> = {
  smallPlates: "Small plates",
  redPies: "Red pies",
  whitePies: "White pies",
  desserts: "Dolci",
};

export const dish = defineType({
  name: "dish",
  title: "Menu item",
  type: "document",
  icon: LemonIcon,
  fields: [
    defineField({
      name: "status",
      title: "Available tonight?",
      type: "string",
      description:
        "Hidden items stay in Studio and can be turned back on. Delete the document if it's off the menu for good.",
      options: {
        list: [
          { title: "Yes — show on the menu", value: "on" },
          { title: "No — hide from the menu tonight (86'd)", value: "off" },
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
      name: "detail",
      title: "Ingredients / note",
      type: "string",
      description: "Shows under the name. Example: tomato, mozz, sausage, onion",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      description: "Just the number as it should look. Example: 26 or 5/ball",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "section",
      title: "Which part of the menu?",
      type: "string",
      options: {
        list: [
          { title: "Small plates", value: "smallPlates" },
          { title: "Red pies", value: "redPies" },
          { title: "White pies", value: "whitePies" },
          { title: "Dolci", value: "desserts" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nuts",
      title: "Contains nuts?",
      type: "boolean",
      description: "Adds a * next to the name.",
      initialValue: false,
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
      title: "Menu order",
      name: "orderAsc",
      by: [
        { field: "section", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", detail: "detail", section: "section", status: "status" },
    prepare({ title, detail, section, status }) {
      const part = sectionLabels[section] ?? section;
      return {
        title: status === "off" ? `${title} (hidden tonight)` : title,
        subtitle: [part, detail].filter(Boolean).join(" · "),
      };
    },
  },
});
