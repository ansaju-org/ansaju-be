import { z } from "zod";

export const recommendationRequestSchema = z.object({
  answer: z.array(z.number().min(1).max(5)).min(12).max(12),
});

export const historyRecommendationRequestSchema = z.object({
  username: z.string().min(1).max(100),
  page: z.number().min(1),
  limit: z.number().min(1),
});
