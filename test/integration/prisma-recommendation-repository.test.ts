import { RecommendationRepository } from "../../src/repository/recommendation-repository";
import { PrismaRecommendationRepository } from "../../src/repository/prisma-recommendation-repository";
import { prisma } from "../../src/infrastructure/database";
import { hashSync } from "bcryptjs";

describe("PrismaRecommendationRepository tests", () => {
  let repository: RecommendationRepository;

  beforeAll(() => {
    repository = new PrismaRecommendationRepository();
  });

  afterEach(async () => {
    await prisma.recommendation.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should be success get history recommendation", async () => {
    await createDummyRecommendations();

    let result = await repository.findHistoryByUsername({
      username: "johndoe",
      page: 1,
      limit: 5,
    });

    expect(result.length).toBe(5);

    result = await repository.findHistoryByUsername({
      username: "johndoe",
      page: 2,
      limit: 3,
    });

    expect(result.length).toBe(2);
  });

  it("should be return empty history recommendation", async () => {
    const result = await repository.findHistoryByUsername({
      username: "johndoe",
      page: 1,
      limit: 5,
    });

    expect(result.length).toBe(0);
  });
});

async function createDummyRecommendations() {
  const user = await prisma.user.create({
    data: {
      email: "johndoe@mail.com",
      name: "John Doe",
      password: hashSync("password", 10),
      username: "johndoe",
    },
  });

  await prisma.recommendation.createMany({
    data: [
      {
        result: "Teknik Informatika",
        userUsername: user.username,
      },
      {
        result: "Sistem Informasi",
        userUsername: user.username,
      },
      {
        result: "Teknik Komputer",
        userUsername: user.username,
      },
      {
        result: "Ilmu Komunikasi",
        userUsername: user.username,
      },
      {
        result: "Ilmu Hukum",
        userUsername: user.username,
      },
    ],
  });
}
