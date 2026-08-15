import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";

import { episodeSchema } from "./content/episode-schema.mjs";
import { projectSchema } from "./content/project-schema.mjs";

const episodes = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{json,yaml,yml}",
    base: "./src/content/episodes",
  }),
  schema: episodeSchema,
});

const project = defineCollection({
  loader: file("./src/content/project.json"),
  schema: projectSchema,
});

export const collections = { episodes, project };
