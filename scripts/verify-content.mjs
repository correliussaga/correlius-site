import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  episodeSchema,
  isPublicEpisode,
  validateEpisodeCollection,
} from "../src/content/episode-schema.mjs";

const fixturePath = fileURLToPath(new URL("../tests/fixtures/episodes.json", import.meta.url));
const fixtures = JSON.parse(await readFile(fixturePath, "utf8"));
const parsed = fixtures.map((episode) => episodeSchema.parse(episode));
const publicEpisodes = validateEpisodeCollection(parsed).filter(isPublicEpisode);

if (publicEpisodes.length !== 4) {
  throw new Error("The public catalog fixture must contain exactly four valid episodes.");
}

if (publicEpisodes.some(({ status, streamUid }) => status !== "coming-soon" || streamUid)) {
  throw new Error("Coming-soon fixture entries must remain non-playable.");
}

const addedEpisode = {
  ...structuredClone(publicEpisodes[3]),
  id: "test-episode-five",
  slug: "a-fifth-path",
  sequence: 5,
  title: "A Fifth Path",
  seo: {
    title: "A Fifth Path — Correlius",
    description:
      "A test-only fifth record proving that an additional episode requires content data without a navigation or route-template edit.",
  },
};

if (validateEpisodeCollection([...publicEpisodes, episodeSchema.parse(addedEpisode)]).length !== 5) {
  throw new Error("Episode N+1 validation failed.");
}

const incompleteRelease = {
  ...structuredClone(publicEpisodes[0]),
  status: "released",
};

if (episodeSchema.safeParse(incompleteRelease).success) {
  throw new Error("An incomplete released episode passed validation.");
}

const releaseImage = {
  src: "/images/episodes/test-release.webp",
  alt: "A test-only episode image",
  width: 1600,
  height: 900,
};
const completeRelease = {
  ...structuredClone(publicEpisodes[0]),
  runtimeSeconds: 615,
  releaseDate: "2026-08-15",
  status: "released",
  streamUid: "test_stream_uid_123",
  captions: [
    {
      language: "en",
      label: "English",
      kind: "captions",
      streamTrackId: "test_caption_track",
      status: "ready",
    },
  ],
  thumbnail: releaseImage,
  poster: releaseImage,
  socialImage: { ...releaseImage, width: 1200, height: 630 },
  credits: [{ role: "Test role", name: "Test credit", note: null }],
  featured: true,
  rightsReviewed: true,
  creditsReviewed: true,
};

if (!episodeSchema.safeParse(completeRelease).success) {
  throw new Error("A complete released episode failed validation.");
}

const placeholderApproval = {
  ...structuredClone(publicEpisodes[0]),
  title: "Placeholder title",
};

if (episodeSchema.safeParse(placeholderApproval).success) {
  throw new Error("Approved placeholder content passed validation.");
}

try {
  validateEpisodeCollection([
    ...publicEpisodes,
    { ...structuredClone(publicEpisodes[3]), id: "duplicate-sequence", slug: "duplicate-sequence" },
  ]);
  throw new Error("A duplicate episode sequence passed collection validation.");
} catch (error) {
  if (!String(error).includes("Duplicate episode sequence")) throw error;
}

try {
  validateEpisodeCollection([
    completeRelease,
    {
      ...structuredClone(completeRelease),
      id: "second-featured-release",
      slug: "second-featured-release",
      sequence: 9,
      seo: {
        title: "Second Featured Release — Correlius",
        description:
          "A distinct test-only metadata record used to confirm that only one released Correlius episode may be selected as featured.",
      },
    },
  ]);
  throw new Error("Multiple featured releases passed collection validation.");
} catch (error) {
  if (!String(error).includes("Only one released episode may be featured")) throw error;
}

console.log("Episode schema, release gates, four-item catalog, and N+1 checks passed.");
