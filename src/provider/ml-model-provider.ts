import {
  RecommendationRequest,
  RecommendationResponse,
} from "../dto/recommendation-dto";

export interface MlModelProvider {
  predict(
    data: Pick<RecommendationRequest, "answer">
  ): Promise<RecommendationResponse>;
}
