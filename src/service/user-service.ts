import { compare, genSalt, hash } from "bcryptjs";
import { User } from "../entity/user";
import {
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
} from "../model/user-model";
import { UserRepository } from "../repository/user-repository";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../validation/user-schemas";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    private validation: Validation
  ) {}

  async register(req: UserRegisterRequest): Promise<UserResponse> {
    const userRequest = this.validation.validate(userRegisterSchema, req);

    const existingUser = await this.userRepository.findByUsername(
      userRequest.username
    );
    if (existingUser) {
      throw new ResponseError(400, "Username already exists");
    }

    const existingUserWithEmail = await this.userRepository.findByEmail(
      userRequest.email
    );
    if (existingUserWithEmail) {
      throw new ResponseError(400, "Email already exists");
    }

    const user = new User(
      userRequest.name,
      userRequest.username,
      userRequest.email,
      userRequest.password
    );

    user.password = await hash(user.password, 10);

    await this.userRepository.insert(user);

    return {
      name: user.name,
      username: user.username,
      email: user.email,
    };
  }

  async login(req: UserLoginRequest): Promise<UserResponse> {
    const userRequest = this.validation.validate(userLoginSchema, req);

    const user = await this.userRepository.findByUsername(userRequest.username);
    if (!user) {
      throw new ResponseError(404, "User not found");
    }

    const isPasswordValid = await compare(userRequest.password, user.password);
    if (!isPasswordValid) {
      throw new ResponseError(401, "Invalid password");
    }

    const token = sign({ username: user.username }, "secret", {
      expiresIn: "1years",
    });

    return {
      ...user,
      token,
    };
  }
}
