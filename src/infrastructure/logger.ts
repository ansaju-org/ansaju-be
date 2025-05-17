import winston from "winston";
import { Config } from "./config";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ format: winston.format.json() }),
  ],
  level: Config.get("APP_LOG_LEVEL"),
});
