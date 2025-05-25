import { injectable } from "tsyringe";
import { RecommendationService } from "../service/recommendation-service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { RecommendationRequest } from "../dto/recommendation-dto";
import { logger } from "../infrastructure/logger";

@injectable()
export class RecommendationHandler {
  constructor(private recommendationService: RecommendationService) {
    this.postRecommendation = this.postRecommendation.bind(this);
  }

  async postRecommendation(req: Request, h: ResponseToolkit) {
    const request = req.payload as RecommendationRequest;
    logger.debug(`payload from recommendation: ${JSON.stringify(request)}`);

    const response = await this.recommendationService.getRecommendation(request);

    return h.response({
      error: false,
      message: "success get recommendation",
      data: response,
    });
  }
}

