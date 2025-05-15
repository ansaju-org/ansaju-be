import { z } from "zod";
import { ResponseError } from "../error/response-error";

export class Validation {
  validate<T extends z.ZodTypeAny>(schema: T, data: unknown) {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ResponseError(400, result.error.message);
    }
    return result.data as z.infer<T>;
  }
}
