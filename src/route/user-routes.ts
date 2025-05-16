import { UserHandler } from "../handler/user-handler";
import { createHapiRouter } from "hapi-routing-wrapper";

export const createUserRoutes = (handler: UserHandler) => {
  const router = createHapiRouter();

  router.post("/api/register", handler.postRegister);
  router.post("/api/login", handler.postLogin);

  return router.getRoutes();
};
