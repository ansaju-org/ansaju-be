import { server } from "@hapi/hapi";
import { container } from "tsyringe";
import { UserHandler } from "../handler/user-handler";
import { createUserRoutes } from "../route/user-routes";

export const createHapiServer = async () => {
  const hapiServer = server({
    port: 9000,
    host: "localhost",
  });

  const userHandler = container.resolve(UserHandler);

  hapiServer.route(createUserRoutes(userHandler));

  await hapiServer.initialize();

  return hapiServer;
}