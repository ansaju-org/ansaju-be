import { container } from "tsyringe";
import { UserRepository } from "../repository/user-repository";
import { PrismaUserRepository } from "../repository/prisma-user-repository";
import { MlModelProvider } from "../provider/ml-model-provider";
import { HttpMlModelProvider } from "../provider/http-ml-model-provider";
import { RecommendationRepository } from "../repository/recommendation-repository";
import { PrismaRecommendationRepository } from "../repository/prisma-recommendation-repository";

container.register<UserRepository>("UserRepository", {
  useClass: PrismaUserRepository,
});

container.register<MlModelProvider>("MlModelProvider", {
  useClass: HttpMlModelProvider,
});

container.register<RecommendationRepository>("RecommendationRepository", {
  useClass: PrismaRecommendationRepository,
});
