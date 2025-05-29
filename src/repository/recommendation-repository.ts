import { HisotryRecommendationRequest } from "../dto/recommendation-dto";
import { RecommendationEntity } from "../entity/recommendation-entity";

export interface RecommendationRepository {
  findHistoryByUsername(req: HisotryRecommendationRequest): Promise<RecommendationEntity[]>;
}
