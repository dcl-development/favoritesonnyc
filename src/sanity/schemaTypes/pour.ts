import { defineField, defineType } from "sanity";
import { IceCreamIcon } from "@sanity/icons/IceCream";

const sectionLabels: Record<string, string> = {
  cocktails: "Cocktails",
  beers: "Beer",
};

export const pour = defineType({
  name: "pour",
  title: "Cocktail or beer",
  type: "document",
  icon: IceCreamIcon,
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
      name: "detail",
      title: "Ingredients / note",
      type: "string",
      description: "Optional. Leave blank for beer if you want.",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "section",
      title: "Cocktail or beer?",
      type: "string",
      options: {
        list: [
          { title: "Cocktails", value: "cocktails" },
          { title: "Beer", value: "beers" },
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
