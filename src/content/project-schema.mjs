import { z } from "astro/zod";

export const projectSchema = z.object({
  id: z.literal("correlius"),
  status: z.enum(["draft", "approved"]),
  name: z.literal("Correlius"),
  descriptor: z.string().min(10).max(100),
  heroHeading: z.string().min(10).max(100),
  heroSummary: z.string().min(40).max(320),
  missionHeading: z.string().min(10).max(120),
  missionParagraphs: z.array(z.string().min(30).max(700)).min(1).max(5),
  themes: z.array(z.string().min(2).max(80)).min(1).max(12),
  availabilityMessage: z.string().min(20).max(300),
});
