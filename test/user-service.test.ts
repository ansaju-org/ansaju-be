import { Validation } from "../src/validation/validation";
import { UserRepository } from "../src/repository/user-repository";
import { UserService } from "../src/service/user-service";
import { UserLoginRequest, UserRegisterRequest } from "../src/model/user-model";
import { mock, MockProxy } from "jest-mock-extended";
import { compareSync, hashSync } from "bcryptjs";
import { ResponseError } from "../src/error/response-error";
import { User } from "../src/entity/user";

describe("UserService tests", () => {
  let validation: Validation;
  let mockUserRepository: MockProxy<UserRepository>;
  let userService: UserService;

  beforeEach(() => {
    validation = new Validation();
    mockUserRepository = mock<UserRepository>();
    userService = new UserService(mockUserRepository, validation);
  });

  it("should be register success", async () => {
    const request: UserRegisterRequest = {
      name: "John Doe",
      email: "johndoe@mail.com",
      username: "johndoe",
      password: "password123",
    };

    mockUserRepository.findByUsername.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const response = await userService.register(request);

    const user = mockUserRepository.insert.mock.calls[0][0];

    expect(response.name).toBe(request.name);
    expect(response.email).toBe(request.email);
    expect(response.username).toBe(request.username);
    expect(user.password).not.toBe(request.password);
    expect(compareSync(request.password, user.password)).toBe(true);
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
      request.username
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(request.email);
  });

  it("should be register failed in validation", async () => {
    const request: UserRegisterRequest = {
      name: "",
      email: "",
      username: "",
      password: "",
    };

    expect(userService.register(request)).rejects.toThrow(ResponseError);
  });

  it("should be register failed username already exists", async () => {
    const request: UserRegisterRequest = {
      name: "John Doe",
      email: "johndoe@mail.com",
      username: "johndoe",
      password: "password123",
    };

    mockUserRepository.findByUsername.mockResolvedValue({ ...request } as User);

    expect(userService.register(request)).rejects.toThrow(
      "Username already exists"
    );
  });

  it("should be register failed email already exists", async () => {
    const request: UserRegisterRequest = {
      name: "John Doe",
      email: "johndoe@mail.com",
      username: "johndoe",
      password: "password123",
    };

    mockUserRepository.findByUsername.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue({ ...request } as User);

    expect(userService.register(request)).rejects.toThrow(
      "Email already exists"
    );
  });

  it("should be login success", async () => {
    const request: UserLoginRequest = {
      username: "johndoe",
      password: "password123",
    };

    const user: User = {
      name: "John Doe",
      email: "johndoe@mail.com",
      username: "johndoe",
      password: hashSync(request.password, 10),
    };

    mockUserRepository.findByUsername.mockResolvedValue(user);

    const response = await userService.login(request);

    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);
    expect(response.username).toBe(user.username);
    expect(response.token).toBeDefined();
  });

  it("should be login failed in validation", async () => {
    const request: UserLoginRequest = {
      username: "",
      password: "",
    };

    expect(userService.login(request)).rejects.toThrow(ResponseError);
  });

  it("should be login failed user not found", async () => {
    const request: UserLoginRequest = {
      username: "johndoe",
      password: "password123",
    };

    mockUserRepository.findByUsername.mockResolvedValue(null);

    expect(userService.login(request)).rejects.toThrow("User not found");
  });

  it("should be login failed password invalid", async () => {
    const request: UserLoginRequest = {
      username: "johndoe",
      password: "password salah",
    };

    const user: User = {
      name: "John Doe",
      email: "johndoe@mail.com",
      username: "johndoe",
      password: hashSync("password123", 10),
    };

    mockUserRepository.findByUsername.mockResolvedValue(user);

    expect(userService.login(request)).rejects.toThrow("Invalid password");
  });
});
