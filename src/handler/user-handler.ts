import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { UserService } from "../service/user-service";
import { UserLoginRequest, UserRegisterRequest } from "../dto/user-dto";
import { injectable } from "tsyringe";
import { logger } from "../infrastructure/logger";

@injectable()
export class UserHandler {
  constructor(private userService: UserService) {
    this.postLogin = this.postLogin.bind(this);
    this.postRegister = this.postRegister.bind(this);
  }

  async postRegister(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    const payload = request.payload as UserRegisterRequest;
    logger.debug(`payload from register: ${JSON.stringify(payload)}`);

    const response = await this.userService.register(payload);

    return h.response({
      error: false,
      message: "User created successfully",
      data: response,
    });
  }

  async postLogin(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    const payload = request.payload as UserLoginRequest;
    logger.debug(`payload from login: ${JSON.stringify(payload)}`);

    const response = await this.userService.login(payload);

    return h.response({
      error: false,
      message: "success login user",
      data: response,
    });
  }
}
