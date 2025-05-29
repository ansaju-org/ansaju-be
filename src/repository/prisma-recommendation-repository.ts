import { HisotryRecommendationRequest } from "../dto/recommendation-dto";
import { RecommendationEntity } from "../entity/recommendation-entity";
import { prisma } from "../infrastructure/database";
import { RecommendationRepository } from "./recommendation-repository";

export class PrismaRecommendationRepository
  implements RecommendationRepository
{
  async findHistoryByUsername(
    req: HisotryRecommendationRequest
  ): Promise<RecommendationEntity[]> {
    const recommendations = await prisma.recommendation.findMany({
      where: {
        userUsername: req.username,
      },
      take: req.limit,
      skip: (req.page - 1) * req.limit,
    });

    return recommendations.map((recommendation) => {
      return new RecommendationEntity(
        recommendation.id,
        recommendation.result,
        recommendation.createdAt
      );
    });
  }
}
