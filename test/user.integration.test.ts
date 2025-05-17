import { Server } from "@hapi/hapi";
import { createHapiServer } from "../src/infrastructure/server";
import "reflect-metadata";
import "../src/infrastructure/container";
import { prisma } from "../src/infrastructure/database";
import { hashSync } from "bcryptjs";

const createUser = async () => {
  return await prisma.user.create({
    data: {
      email: "test@gmail.com",
      name: "John Doe",
      username: "johndoe",
      password: hashSync("testpassword", 10),
    },
  });
};

describe("POST /register", () => {
  let server: Server;

  beforeAll(async () => {
    server = await createHapiServer();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should register a new user", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/register",
      payload: {
        email: "test@gmail.com",
        name: "John Doe",
        username: "johndoe",
        password: "testpassword",
      },
    });

    expect(response.statusCode).toBe(200);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(false);
    expect(responseData.message).toBe("User created successfully");
    expect(responseData.data).toBeDefined();
    expect(responseData.data.email).toBe("test@gmail.com");
    expect(responseData.data.name).toBe("John Doe");
    expect(responseData.data.username).toBe("johndoe");
  });

  it("should return error because username already exists", async () => {
    const user = await createUser();

    const response = await server.inject({
      method: "POST",
      url: "/register",
      payload: {
        email: user.email,
        name: user.name,
        username: user.username,
        password: user.password,
      },
    });

    expect(response.statusCode).toBe(400);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("Username already exists");
    expect(responseData.data).toBeUndefined();
  });

  it("should return error because email already exists", async () => {
    const user = await createUser();

    const response = await server.inject({
      method: "POST",
      url: "/register",
      payload: {
        email: user.email,
        name: "John Doe 2",
        username: "johndoe2",
        password: "password123",
      },
    });

    expect(response.statusCode).toBe(400);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("Email already exists");
    expect(responseData.data).toBeUndefined();
  });

  it("should return error because payload is empty", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/register",
      payload: {},
    });

    expect(response.statusCode).toBe(400);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(true);
    expect(responseData.message).toContain("Invalid request payload");
    expect(responseData.data).toBeUndefined();
  });
});

describe("POST /login", () => {
  let server: Server;

  beforeAll(async () => {
    server = await createHapiServer();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("should login a user", async () => {
    const user = await createUser();

    const response = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: user.username,
        password: "testpassword",
      },
    });

    expect(response.statusCode).toBe(200);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(false);
    expect(responseData.message).toBe("success login user");
    expect(responseData.data).toBeDefined();
    expect(responseData.data.email).toBe(user.email);
    expect(responseData.data.name).toBe(user.name);
    expect(responseData.data.username).toBe(user.username);
    expect(responseData.data.token).toBeDefined();
    expect(responseData.data.password).toBeUndefined();
  });

  it("should return error because user not found", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "invalidusername",
        password: "invalidpassword",
      },
    });

    expect(response.statusCode).toBe(401);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("Invalid username or password");
    expect(responseData.data).toBeUndefined();
  });

  it("should return error because invalid password", async () => {
    const user = await createUser();

    const response = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: user.username,
        password: "invalidpassword",
      },
    });

    expect(response.statusCode).toBe(401);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(true);
    expect(responseData.message).toBe("Invalid username or password");
    expect(responseData.data).toBeUndefined();
  });

  it("should return error because payload is empty", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/login",
      payload: {},
    });

    expect(response.statusCode).toBe(400);

    const responseData = JSON.parse(response.payload);

    expect(responseData.error).toBe(true);
    expect(responseData.message).toContain("Invalid request payload");
    expect(responseData.data).toBeUndefined();
  });
});
