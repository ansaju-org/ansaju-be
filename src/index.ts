import "reflect-metadata";
import "./infrastructure/container";
import { createHapiServer } from "./infrastructure/server";
import { logger } from "./infrastructure/logger";

async function main() {
  const hapiServer = await createHapiServer();
  await hapiServer.start();
  logger.info(`Server running on ${hapiServer.info.uri}`);
}
main();
