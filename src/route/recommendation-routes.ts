import { createHapiRouter } from "hapi-routing-wrapper";
import { RecommendationHandler } from "../handler/recommendation-handler";

export const createRecommendationRoutes = (handler: RecommendationHandler) => {
  const router = createHapiRouter();

  router.post("/recommendation", handler.postRecommendation);

  return router.getRoutes();
};
