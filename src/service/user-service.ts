import { compare, genSalt, hash } from "bcryptjs";
import { UserEntity } from "../entity/user-entity";
import {
  UserLoginRequest,
  UserRegisterRequest,
  UserResponse,
} from "../dto/user-dto";
import { UserRepository } from "../repository/user-repository";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../validation/user-schemas";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { logger } from "../infrastructure/logger";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    private validation: Validation
  ) {
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  async register(req: UserRegisterRequest): Promise<UserResponse> {
    const userRequest = this.validation.validate(userRegisterSchema, req);
    logger.debug(`userRequest: ${JSON.stringify(userRequest)}`);

    const existingUser = await this.userRepository.findByUsername(
      userRequest.username
    );
    if (existingUser) {
      logger.error(`Username already exists: ${userRequest.username}`);
      throw new ResponseError(400, "Username already exists");
    }

    const existingUserWithEmail = await this.userRepository.findByEmail(
      userRequest.email
    );
    if (existingUserWithEmail) {
      logger.error(`Email already exists: ${userRequest.email}`);
      throw new ResponseError(400, "Email already exists");
    }

    const user = new UserEntity(
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
    logger.debug(`userRequest: ${JSON.stringify(userRequest)}`);

    const user = await this.userRepository.findByUsername(userRequest.username);
    if (!user) {
      logger.error(`User not found: ${userRequest.username}`);
      throw new ResponseError(401, "Invalid username or password");
    }

    const isPasswordValid = await compare(userRequest.password, user.password);
    if (!isPasswordValid) {
      logger.error(`Invalid password: ${userRequest.password}`);
      throw new ResponseError(401, "Invalid username or password");
    }

    const token = sign({ username: user.username }, "secret", {
      expiresIn: "1years",
    });

    return {
      email: user.email,
      name: user.name,
      username: user.username,
      token,
    };
  }
}
