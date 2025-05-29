import { z } from "zod";
import {
  historyRecommendationRequestSchema,
  recommendationRequestSchema,
} from "../validation/recommendation-schemas";

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;

export type RecommendationResponse = {
  id?: number;
  jurusan: string;
  created_at?: Date;
};

export type HisotryRecommendationRequest = z.infer<
  typeof historyRecommendationRequestSchema 
>;
