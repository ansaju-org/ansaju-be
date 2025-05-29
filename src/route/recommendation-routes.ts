import { createHapiRouter } from "hapi-routing-wrapper";
import { RecommendationHandler } from "../handler/recommendation-handler";

export const createRecommendationRoutes = (handler: RecommendationHandler) => {
  const router = createHapiRouter();

  router.post("/recommendations", handler.postRecommendation);
  router.get("/recommendations/history", handler.getRecommendationsHistory);

  return router.getRoutes();
};
