import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { schemaTemplates } from "./src/sanity/schemaTypes/templates";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "favoriteson",
  title: "favorite son",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      title: "Edit the website",
      structure,
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter(
        (template) => !["dish", "wine", "pour"].includes(template.schemaType),
      ),
      ...schemaTemplates,
    ],
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((template) => template.templateId !== "story");
      }
      return prev;
    },
    actions: (prev, { schemaType }) => {
      if (schemaType === "story") {
        return prev.filter((action) => action.action !== "duplicate");
      }
      return prev;
    },
  },
});
