import { z } from "zod";
import { recommendationRequestSchema } from "../validation/recommendation-schemas";

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;

export type RecommendationResponse = {
  jurusan: string;
}