import { injectable } from "tsyringe";
import { User } from "../entity/user";
import { prisma } from "../infrastructure/database";
import { UserRepository } from "./user-repository";

@injectable()
export class PrismaUserRepository implements UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async insert(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
