import { inject, injectable } from "tsyringe";
import { Validation } from "../validation/validation";
import { MlModelGateway } from "../gateway/ml-model-gateway";
import { RecommendationRequest, RecommendationResponse } from "../dto/recommendation-dto";
import { recommendationRequestSchema } from "../validation/recommendation-schemas";

@injectable()
export class RecommendationService {
  constructor(
    private validation: Validation,
    @inject("MlModelGateway") private mlModelGateway: MlModelGateway
  ) {
    this.getRecommendation = this.getRecommendation.bind(this);
  }

  async getRecommendation(req: RecommendationRequest): Promise<RecommendationResponse> {
    const request = this.validation.validate(recommendationRequestSchema, req);

    const response = await this.mlModelGateway.predict(request);

    return response;
  }
}
