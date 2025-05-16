import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { UserService } from "../service/user-service";
import { UserLoginRequest, UserRegisterRequest } from "../model/user-model";
import { injectable } from "tsyringe";

@injectable()
export class UserHandler {
  constructor(private userService: UserService) {}

  async postRegister(
    request: Request,
    h: ResponseToolkit
  ): Promise<ResponseObject> {
    const payload = request.payload as UserRegisterRequest;

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

    const response = await this.userService.login(payload);

    return h.response({
      error: false,
      message: "success login user",
      data: response,
    });
  }
}
