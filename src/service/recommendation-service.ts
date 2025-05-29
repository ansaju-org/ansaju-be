import { inject, injectable } from "tsyringe";
import { Validation } from "../validation/validation";
import { MlModelGateway } from "../gateway/ml-model-gateway";
import {
  RecommendationRequest,
  RecommendationResponse,
} from "../dto/recommendation-dto";
import { recommendationRequestSchema } from "../validation/recommendation-schemas";
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
}
