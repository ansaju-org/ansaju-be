import { container } from "tsyringe";
import { UserRepository } from "../repository/user-repository";
import { PrismaUserRepository } from "../repository/prisma-user-repository";

container.register<UserRepository>("UserRepository", {
  useClass: PrismaUserRepository,
});
