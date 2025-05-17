import { z } from "zod";

export const userRegisterSchema = z.object({
  name: z.string().min(1).max(100),
  username: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
  email: z.string().email(),
});

export const userLoginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
});