import { server } from "@hapi/hapi";
import { container } from "tsyringe";
import { UserHandler } from "../handler/user-handler";
import { createUserRoutes } from "../route/user-routes";
import { ResponseError } from "../error/response-error";
import { logger } from "./logger";
import { Config } from "./config";
import { createRecommendationRoutes } from "../route/recommendation-routes";
import { RecommendationHandler } from "../handler/recommendation-handler";
import { verify } from "jsonwebtoken";

export const createHapiServer = async () => {
  const hapiServer = server({
    port: Config.get("APP_PORT"),
    host: Config.get("APP_HOST"),
    routes: {
      cors: {
        origin: ["https://ansaju.netlify.app"],
        additionalHeaders: [
          "cache-control",
          "x-requested-with",
          "authorization",
          "content-type",
        ],
        additionalExposedHeaders: ["authorization"],
        credentials: true,
      },
    },
  });

  const userHandler = container.resolve(UserHandler);
  const recommendationHandler = container.resolve(RecommendationHandler);

  hapiServer.route(createUserRoutes(userHandler));
  hapiServer.route(createRecommendationRoutes(recommendationHandler));

  hapiServer.ext("onRequest", (request, h) => {
    // Bypass preflight request
    if (request.method === "options") {
      return h.continue;
    }

    const publicRoutes = ["/login", "/register"];
    if (publicRoutes.includes(request.path)) {
      return h.continue;
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ResponseError(401, "Unauthorized");
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = verify(token, Config.get("APP_JWT_SECRET")) as any;
      request.app.user = {
        ...decoded,
      };
      return h.continue;
    } catch (error) {
      throw new ResponseError(401, "Unauthorized");
    }
  });

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

declare module "@hapi/hapi" {
  interface RequestApplicationState {
    user?: {
      username: string;
      // tambahkan properti hasil decode JWT kamu
      [key: string]: any;
    };
  }
}
