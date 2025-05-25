import {
  RecommendationRequest,
  RecommendationResponse,
} from "../dto/recommendation-dto";

export interface MlModelGateway {
  predict(data: RecommendationRequest): Promise<RecommendationResponse>;
}
