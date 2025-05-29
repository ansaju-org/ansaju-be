import { Server } from "@hapi/hapi";
import { createHapiServer } from "../../src/infrastructure/server";
import "reflect-metadata";
import "../../src/infrastructure/container";
import { prisma } from "../../src/infrastructure/database";
import { createUser } from "./user.integration.test";
import { sign } from "jsonwebtoken";
import { Config } from "../../src/infrastructure/config";

describe("POST /recommendations", () => {
  let server: Server;
  let jwtToken: string;

  beforeAll(async () => {
    server = await createHapiServer();
  });

  beforeEach(async () => {
    jwtToken = await createToken();
  });

  afterEach(async () => {
    await prisma.recommendation.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should get recommendation success", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/recommendations",
      payload: {
        answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 1],
      },
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseData = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(responseData.data.jurusan).toBeDefined();
    expect(responseData.message).toEqual("success get recommendation");
    expect(responseData.error).toEqual(false);
    console.log(responseData.data.jurusan);
  });

  it("should be failed unauthorized", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/recommendations",
      payload: {
        answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 1],
      },
    });

    const responseData = JSON.parse(response.payload);

    expect(response.statusCode).toBe(401);
    expect(responseData.error).toEqual(true);
    expect(responseData.message).toEqual("Unauthorized");
  });

  it("should be failed unauthorized because token is wrong", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/recommendations",
      payload: {
        answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 1],
      },
      headers: {
        Authorization: `Bearer wrongtoken`,
      },
    });

    const responseData = JSON.parse(response.payload);

    expect(response.statusCode).toBe(401);
    expect(responseData.error).toEqual(true);
    expect(responseData.message).toEqual("Unauthorized");
  });

  it("should be failed because answer array length less than 12", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/recommendations",
      payload: {
        answer: [1, 2, 3, 4, 5, 2, 3, 4, 5],
      },
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseData = JSON.parse(response.payload);

    expect(response.statusCode).toBe(400);
    expect(responseData.error).toEqual(true);
    expect(responseData.message).toContain("Invalid request payload");
  });

  it("should be failed because one of value array greater than 5", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/recommendations",
      payload: {
        answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 6],
      },
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseData = JSON.parse(response.payload);

    expect(response.statusCode).toBe(400);
    expect(responseData.error).toEqual(true);
    expect(responseData.message).toContain("Invalid request payload");
  });
});

describe("GET /recommendations/history", () => {
  let server: Server;
  let jwtToken: string;

  beforeAll(async () => {
    server = await createHapiServer();
  });

  beforeEach(async () => {
    jwtToken = await createToken();
  });

  afterEach(async () => {
    await prisma.recommendation.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should be success return recommendation history", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/recommendations/history",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(false);
    expect(responseData.message).toBe("success get recommendation history");
    expect(responseData.data.length).toBe(5);
    console.log(responseData.data);
    expect(responseData.pagination.page).toBe(1);
    expect(responseData.pagination.limit).toBe(5);
  });

  it("should be success return recommendation history with pagination", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/recommendations/history?page=2&limit=3",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(false);
    expect(responseData.message).toBe("success get recommendation history");
    expect(responseData.data.length).toBe(2);
    console.log(responseData.data);
    expect(responseData.pagination.page).toBe(2);
    expect(responseData.pagination.limit).toBe(3);
  });
});

const createToken = async () => {
  const user = await createUser();
  createRecommendations(user.username);
  return sign({ username: user.username }, Config.get("APP_JWT_SECRET"));
};

async function createRecommendations(username: string) {
  await prisma.recommendation.createMany({
    data: [
      {
        result: "Teknik Informatika",
        userUsername: username,
      },
      {
        result: "Sistem Informasi",
        userUsername: username,
      },
      {
        result: "Teknik Komputer",
        userUsername: username,
      },
      {
        result: "Ilmu Komunikasi",
        userUsername: username,
      },
      {
        result: "Ilmu Hukum",
        userUsername: username,
      },
    ],
  });
}
