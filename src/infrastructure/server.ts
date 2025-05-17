import { server } from "@hapi/hapi";
import { container } from "tsyringe";
import { UserHandler } from "../handler/user-handler";
import { createUserRoutes } from "../route/user-routes";
import { ResponseError } from "../error/response-error";
import { logger } from "./logger";
import { Config } from "./config";

export const createHapiServer = async () => {
  const hapiServer = server({
    port: Config.get("APP_PORT"),
    host: Config.get("APP_HOST"),
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const userHandler = container.resolve(UserHandler);

  hapiServer.route(createUserRoutes(userHandler));

  hapiServer.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ResponseError) {
      logger.error(response.message);
      return h
        .response({
          error: true,
          message: response.message,
        })
        .code(response.statusCode);
    } else if (response instanceof Error) {
      logger.error(response.message);
      return h
        .response({
          error: true,
          message: "Internal server error",
        })
        .code(500);
    } else {
      return h.continue;
    }
  });

  await hapiServer.initialize();

  return hapiServer;
};
