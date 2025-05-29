import {
  RecommendationRequest,
  RecommendationResponse,
} from "../dto/recommendation-dto";

export interface MlModelGateway {
  predict(
    data: Pick<RecommendationRequest, "answer">
  ): Promise<RecommendationResponse>;
}
