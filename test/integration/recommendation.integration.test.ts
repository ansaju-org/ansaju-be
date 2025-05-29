import { Server } from "@hapi/hapi";
import { createHapiServer } from "../../src/infrastructure/server";
import "reflect-metadata";
import "../../src/infrastructure/container";
import { prisma } from "../../src/infrastructure/database";
import { createUser } from "./user.integration.test";
import { sign } from "jsonwebtoken";
import { Config } from "../../src/infrastructure/config";

describe("POST /recommendation", () => {
  let server: Server;
  let jwtToken: string;

  beforeAll(async () => {
    server = await createHapiServer();
    jwtToken = await createToken();
  });

  afterAll(async () => {
    await prisma.recommendation.deleteMany();
    await prisma.user.deleteMany();
    await server.stop();
  });

  it("should get recommendation success", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/recommendation",
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
      url: "/recommendation",
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
      url: "/recommendation",
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
      url: "/recommendation",
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
      url: "/recommendation",
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

const createToken = async () => {
  const user = await createUser();
  return sign({ username: user.username }, Config.get("APP_JWT_SECRET"));
};
