import { config } from "dotenv";

export class Config {
  static {
    config();
  }

  static get(key: string): string {
    const val = process.env[key];
    if (!val) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    return val;
  }
}