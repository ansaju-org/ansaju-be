import { z } from "zod";
import { userLoginSchema, userRegisterSchema } from "../validation/user-schemas";

export type UserRegisterRequest = z.infer<typeof userRegisterSchema>;

export type UserLoginRequest = z.infer<typeof userLoginSchema>;

export type UserResponse = {
  name: string;
  email: string;
  username: string;
  token?: string;
}