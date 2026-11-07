"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemas";

const SINGLETON = "profile";

export default defineConfig({
  name: "portfolio",
  title: "Ivan Torrente Portfolio",
  basePath: "/studio",
  // defineConfig needs a value, and /studio shows setup steps until a real ID is set.
  projectId: projectId || "unconfigured",
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== SINGLETON),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === SINGLETON
        ? actions.filter(({ action }) => action !== "delete" && action !== "duplicate")
        : actions,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Profile")
              .id(SINGLETON)
              .child(S.document().schemaType(SINGLETON).documentId(SINGLETON)),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => item.getId() !== SINGLETON),
          ]),
    }),
  ],
});
