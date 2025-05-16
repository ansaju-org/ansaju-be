import { server } from "@hapi/hapi";
import { container } from "tsyringe";
import { UserHandler } from "../handler/user-handler";
import { createUserRoutes } from "../route/user-routes";
import { ResponseError } from "../error/response-error";
import { logger } from "./logger";

export const createHapiServer = async () => {
  const hapiServer = server({
    port: 9000,
    host: "localhost",
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
    }

    return h.continue;
  });

  await hapiServer.initialize();

  return hapiServer;
};
