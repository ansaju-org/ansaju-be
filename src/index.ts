import "reflect-metadata";
import "./infrastructure/container";
import { createHapiServer } from "./infrastructure/server";

async function main() {
  const hapiServer = await createHapiServer();
  await hapiServer.start();
  console.log(`Server running on ${hapiServer.info.uri}`);
}
main();
