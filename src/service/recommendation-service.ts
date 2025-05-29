import { inject, injectable } from "tsyringe";
import { Validation } from "../validation/validation";
import { MlModelGateway } from "../gateway/ml-model-gateway";
import {
  HisotryRecommendationRequest,
  RecommendationRequest,
  RecommendationResponse,
} from "../dto/recommendation-dto";
import {
  historyRecommendationRequestSchema,
  recommendationRequestSchema,
} from "../validation/recommendation-schemas";
import { RecommendationRepository } from "../repository/recommendation-repository";
import { RecommendationEntity } from "../entity/recommendation-entity";

@injectable()
export class RecommendationService {
  constructor(
    private validation: Validation,
    @inject("MlModelGateway") private mlModelGateway: MlModelGateway,
    @inject("RecommendationRepository")
    private recommendationRepository: RecommendationRepository
  ) {
    this.getRecommendation = this.getRecommendation.bind(this);
    this.getHistory = this.getHistory.bind(this);
  }

  async getRecommendation(
    req: RecommendationRequest
  ): Promise<RecommendationResponse> {
    const request = this.validation.validate(recommendationRequestSchema, req);

    const response = await this.mlModelGateway.predict({
      answer: request.answer,
    });

    const recommendation = new RecommendationEntity(
      response.jurusan,
      request.username
    );

    await this.recommendationRepository.insert(recommendation);

    return response;
  }

  async getHistory(
    req: HisotryRecommendationRequest
  ): Promise<RecommendationResponse[]> {
    const request = this.validation.validate(
      historyRecommendationRequestSchema,
      req
    );

    const result = await this.recommendationRepository.findHistoryByUsername(
      request
    );

    return result.map((value) => ({
      jurusan: value.result,
      id: value.id,
      created_at: value.createdAt,
    }));
  }
}
