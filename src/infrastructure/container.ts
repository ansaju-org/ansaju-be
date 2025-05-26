import { container } from "tsyringe";
import { UserRepository } from "../repository/user-repository";
import { PrismaUserRepository } from "../repository/prisma-user-repository";
import { MlModelGateway } from "../gateway/ml-model-gateway";
import { HttpMlModelGateway } from "../gateway/http-ml-model-gateway";

container.register<UserRepository>("UserRepository", {
  useClass: PrismaUserRepository,
});

container.register<MlModelGateway>("MlModelGateway", {
  useClass: HttpMlModelGateway,
});