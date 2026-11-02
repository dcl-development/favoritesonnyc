import { defineArrayMember, defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";

export const story = defineType({
  name: "story",
  title: "Our story",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "text",
      title: "Story",
      type: "array",
      description: "The words on the Our Story page. Press Enter for a new paragraph. Bold, italic and links only.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "Link",
                    type: "url",
                    description: "A web address (https://…) or an email (mailto:…).",
                    validation: (rule) =>
                      rule.required().uri({ scheme: ["https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "The photo at the top of Our Story. Leave it empty to keep the kitchen photo. After you upload, click the photo to choose what stays in the frame.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the photo for someone who can’t see it. Example: Danny and Graceanne in the kitchen.",
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as { asset?: { _ref?: string } } | undefined;
              if (parent?.asset?._ref && !alt) {
                return "Add a short description of the photo.";
              }
              return true;
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: { media: "image", alt: "image.alt", text: "text" },
    prepare({ media, alt, text }) {
      const first = Array.isArray(text)
        ? (text as { children?: { text?: string }[] }[])
            .flatMap((block) => block.children ?? [])
            .map((child) => child.text ?? "")
            .join("")
        : "";
      return {
        title: "Our story",
        subtitle: first || alt || "Kitchen photo until you add one",
        media,
      };
    },
  },
});
