import { z } from "zod";

export const recommendationRequestSchema = z.object({
  answer: z.array(z.number().min(1).max(5)).min(12).max(12),
});
