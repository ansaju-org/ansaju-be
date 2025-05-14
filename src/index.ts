import { server } from "@hapi/hapi";

async function main() {
  const hapiServer = server({
    port: 8080,
  });

  await hapiServer.start();
}
main();
