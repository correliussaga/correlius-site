import { z } from "astro/zod";

const isoDate = /^\d{4}-\d{2}-\d{2}$/u;
const publicAsset = /^\/images\/[a-z0-9][a-z0-9/_-]*\.(?:avif|jpe?g|png|webp)$/u;
const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const safeStreamValue = /^[A-Za-z0-9_-]+$/u;
const placeholderText = /(?:\bplaceholder\b|\blorem\b|\bTODO\b|\bTBD\b|\bfixture\b)/iu;

export const releaseStatuses = ["draft", "coming-soon", "released", "unpublished"];

const imageSchema = z.object({
  src: z.string().regex(publicAsset, "Images must use a versioned /images/ asset path."),
  alt: z.string().max(180),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const captionSchema = z.object({
  language: z.string().min(2).max(35),
  label: z.string().min(1).max(80),
  kind: z.literal("captions"),
  streamTrackId: z.string().regex(safeStreamValue).nullable(),
  status: z.enum(["draft", "processing", "ready"]),
});

const creditSchema = z.object({
  role: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  note: z.string().max(240).nullable(),
});

const seoSchema = z.object({
  title: z.string().min(15).max(70),
  description: z.string().min(50).max(170),
});

export const episodeSchema = z
  .object({
    id: z.string().regex(safeSlug),
    slug: z.string().regex(safeSlug),
    sequence: z.number().int().positive(),
    title: z.string().min(1).max(120),
    shortSynopsis: z.string().min(1).max(500),
    synopsis: z.string().min(1).max(2_500),
    runtimeSeconds: z.number().int().positive().nullable(),
    releaseDate: z.string().regex(isoDate).nullable(),
    status: z.enum(releaseStatuses),
    streamUid: z.string().regex(safeStreamValue).nullable(),
    captions: z.array(captionSchema),
    thumbnail: imageSchema.nullable(),
    poster: imageSchema.nullable(),
    socialImage: imageSchema.nullable(),
    contentContext: z.string().min(1).max(500).nullable(),
    credits: z.array(creditSchema),
    featured: z.boolean(),
    contentApproved: z.boolean(),
    rightsReviewed: z.boolean(),
    creditsReviewed: z.boolean(),
    seo: seoSchema.nullable(),
  })
  .superRefine((episode, context) => {
    const publicText = [
      episode.title,
      episode.shortSynopsis,
      episode.synopsis,
      episode.seo?.title,
      episode.seo?.description,
    ]
      .filter(Boolean)
      .join(" ");

    if (episode.contentApproved && placeholderText.test(publicText)) {
      context.addIssue({
        code: "custom",
        message: "Approved episode content cannot contain placeholder markers.",
        path: ["contentApproved"],
      });
    }

    if (episode.status === "coming-soon" && !episode.contentApproved) {
      context.addIssue({
        code: "custom",
        message: "Coming-soon records require explicit content approval.",
        path: ["contentApproved"],
      });
    }

    if (episode.status !== "released") return;

    const requiredReleaseValues = [
      ["runtimeSeconds", episode.runtimeSeconds],
      ["releaseDate", episode.releaseDate],
      ["streamUid", episode.streamUid],
      ["thumbnail", episode.thumbnail],
      ["poster", episode.poster],
      ["socialImage", episode.socialImage],
      ["seo", episode.seo],
    ];

    for (const [field, value] of requiredReleaseValues) {
      if (value === null) {
        context.addIssue({
          code: "custom",
          message: `Released episodes require ${field}.`,
          path: [field],
        });
      }
    }

    if (
      episode.socialImage &&
      (episode.socialImage.width !== 1200 || episode.socialImage.height !== 630)
    ) {
      context.addIssue({
        code: "custom",
        message: "Released episode social images must be 1200×630 pixels.",
        path: ["socialImage"],
      });
    }

    if (!episode.captions.some(({ language, status }) => language === "en" && status === "ready")) {
      context.addIssue({
        code: "custom",
        message: "Released episodes require a ready English caption track.",
        path: ["captions"],
      });
    }

    if (episode.credits.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Released episodes require at least one reviewed credit.",
        path: ["credits"],
      });
    }

    for (const [field, value] of [
      ["contentApproved", episode.contentApproved],
      ["rightsReviewed", episode.rightsReviewed],
      ["creditsReviewed", episode.creditsReviewed],
    ]) {
      if (!value) {
        context.addIssue({
          code: "custom",
          message: `Released episodes require ${field} approval.`,
          path: [field],
        });
      }
    }
  });

export const isPublicEpisode = (episode) =>
  episode.status === "released" ||
  (episode.status === "coming-soon" && episode.contentApproved);

export const sortEpisodes = (episodes) =>
  [...episodes].sort(
    (left, right) =>
      left.sequence - right.sequence ||
      (left.releaseDate ?? "9999-12-31").localeCompare(right.releaseDate ?? "9999-12-31"),
  );

export const validateEpisodeCollection = (episodes) => {
  const ids = new Set();
  const slugs = new Set();
  const sequences = new Set();
  const seoTitles = new Set();
  const seoDescriptions = new Set();
  let featuredReleased = 0;

  for (const episode of episodes) {
    for (const [label, value, values] of [
      ["id", episode.id, ids],
      ["slug", episode.slug, slugs],
      ["sequence", episode.sequence, sequences],
    ]) {
      if (values.has(value)) throw new Error(`Duplicate episode ${label}: ${value}`);
      values.add(value);
    }

    if (episode.featured && episode.status === "released") featuredReleased += 1;

    if (episode.contentApproved && episode.seo) {
      for (const [label, value, values] of [
        ["SEO title", episode.seo.title, seoTitles],
        ["SEO description", episode.seo.description, seoDescriptions],
      ]) {
        if (values.has(value)) throw new Error(`Duplicate episode ${label}: ${value}`);
        values.add(value);
      }
    }
  }

  if (featuredReleased > 1) throw new Error("Only one released episode may be featured.");
  return sortEpisodes(episodes);
};

export const formatRuntime = (runtimeSeconds) => {
  if (!runtimeSeconds) return null;
  const minutes = Math.floor(runtimeSeconds / 60);
  const seconds = runtimeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
