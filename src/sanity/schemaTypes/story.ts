import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";

export const story = defineType({
  name: "story",
  title: "Our story",
  type: "document",
  icon: ImageIcon,
  fields: [
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
    select: { media: "image", alt: "image.alt" },
    prepare({ media, alt }) {
      return {
        title: "Our story",
        subtitle: alt || "Kitchen photo until you add one",
        media,
      };
    },
  },
});
