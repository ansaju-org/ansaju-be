import { UserEntity } from "../src/entity/user-entity";
import { prisma } from "../src/infrastructure/database";
import { PrismaUserRepository } from "../src/repository/prisma-user-repository";
import { UserRepository } from "../src/repository/user-repository";

describe("PrismaUserRepository tests", () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new PrismaUserRepository();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should create a user and find it by username", async () => {
    const user = new UserEntity("John Doe", "johndoe", "johndoe@mail.com", "123456");
    await repository.insert(user);

    const foundUser = await repository.findByUsername("johndoe");
    if (!foundUser) {
      throw new Error("User not found");
    }

    expect(foundUser).toBeInstanceOf(UserEntity);
    expect(foundUser.name).toBe(user.name);
    expect(foundUser.username).toBe(user.username);
    expect(foundUser.email).toBe(user.email);
    expect(foundUser.password).toBe(user.password);
  });

  it("should not find a user with an invalid username", async () => {
    const foundUser = await repository.findByUsername("invalidusername");
    expect(foundUser).toBeNull();
  });

  it("should create a user and find it by email", async () => {
    const user = new UserEntity("John Doe", "johndoe", "johndoe@mail.com", "123456");
    await repository.insert(user);

    const foundUser = await repository.findByEmail("johndoe@mail.com");
    if (!foundUser) {
      throw new Error("User not found");
    }

    expect(foundUser).toBeInstanceOf(UserEntity);
    expect(foundUser.name).toBe(user.name);
    expect(foundUser.username).toBe(user.username);
    expect(foundUser.email).toBe(user.email);
    expect(foundUser.password).toBe(user.password);
  });

  it("should not find a user with an invalid email", async () => {
    const foundUser = await repository.findByEmail("invalid@email.com");
    expect(foundUser).toBeNull();
  });
});
