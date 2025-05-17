import { injectable } from "tsyringe";
import { UserEntity } from "../entity/user-entity";
import { prisma } from "../infrastructure/database";
import { UserRepository } from "./user-repository";

@injectable()
export class PrismaUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<UserEntity | null> {
    const data = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return data
      ? new UserEntity(data.name, data.username, data.email, data.password)
      : null;
  }

  async insert(user: UserEntity): Promise<void> {
    await prisma.user.create({
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const data = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return data
      ? new UserEntity(data.name, data.username, data.email, data.password)
      : null;
  }
}
