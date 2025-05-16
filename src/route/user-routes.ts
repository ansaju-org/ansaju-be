import { UserHandler } from "../handler/user-handler";
import { createHapiRouter } from "hapi-routing-wrapper";

export const createUserRoutes = (handler: UserHandler) => {
  const router = createHapiRouter();

  router.post("/register", handler.postRegister);
  router.post("/login", handler.postLogin);

  return router.getRoutes();
};
