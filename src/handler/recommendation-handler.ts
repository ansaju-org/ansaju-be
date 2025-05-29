import { injectable } from "tsyringe";
import { RecommendationService } from "../service/recommendation-service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  HisotryRecommendationRequest,
  RecommendationRequest,
} from "../dto/recommendation-dto";
import { logger } from "../infrastructure/logger";
import { error } from "winston";

@injectable()
export class RecommendationHandler {
  constructor(private recommendationService: RecommendationService) {
    this.postRecommendation = this.postRecommendation.bind(this);
    this.getRecommendationsHistory = this.getRecommendationsHistory.bind(this);
  }

  async postRecommendation(req: Request, h: ResponseToolkit) {
    const request = req.payload as RecommendationRequest;
    logger.debug(`payload from recommendation: ${JSON.stringify(request)}`);
    logger.debug(`user: ${req.app.user?.username}`);

    request.username = req.app.user!.username;

    const response = await this.recommendationService.getRecommendation(
      request
    );

    return h.response({
      error: false,
      message: "success get recommendation",
      data: response,
    });
  }

  async getRecommendationsHistory(req: Request, h: ResponseToolkit) {
    const request: HisotryRecommendationRequest = {
      username: req.app.user!.username,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 5,
    };
    logger.debug(`request get history page: ${request.page}`);
    logger.debug(`request get history limit: ${request.limit}`);

    const response = await this.recommendationService.getHistory(request);

    return h.response({
      error: false,
      message: "success get recommendation history",
      data: response,
      pagination: {
        page: request.page,
        limit: request.limit,
      },
    });
  }
}
