import { z } from "zod";
import { ResponseError } from "../error/response-error";
import { injectable } from "tsyringe";
import { logger } from "../infrastructure/logger";

@injectable()
export class Validation {
  validate<T extends z.ZodTypeAny>(schema: T, data: unknown) {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ResponseError(
        400,
        `Invalid request payload: ${result.error.message}`
      );
    }
    return result.data as z.infer<T>;
  }
}
