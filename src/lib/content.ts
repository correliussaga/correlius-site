import { getCollection, getEntry, type CollectionEntry } from "astro:content";

import { isPublicEpisode, validateEpisodeCollection } from "../content/episode-schema.mjs";

export async function getProject() {
  const project = await getEntry("project", "correlius");
  if (!project) throw new Error("The Correlius project singleton is missing.");
  return project.data;
}

export async function getAllEpisodes() {
  const entries = await getCollection("episodes");
  const sortedData = validateEpisodeCollection(entries.map(({ data }) => data));
  const entryById = new Map(entries.map((entry) => [entry.data.id, entry]));
  return sortedData.map(({ id }) => entryById.get(id)!) as CollectionEntry<"episodes">[];
}

export async function getPublicEpisodes() {
  return (await getAllEpisodes()).filter(({ data }) => isPublicEpisode(data));
}
