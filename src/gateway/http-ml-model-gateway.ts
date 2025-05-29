import { injectable } from "tsyringe";
import { MlModelGateway } from "./ml-model-gateway";
import {
  RecommendationRequest,
  RecommendationResponse,
} from "../dto/recommendation-dto";
import { ResponseError } from "../error/response-error";
import { logger } from "../infrastructure/logger";
import { Config } from "../infrastructure/config";

@injectable()
export class HttpMlModelGateway implements MlModelGateway {
  async predict(data: Pick<RecommendationRequest, "answer">): Promise<RecommendationResponse> {
    const url = Config.get("APP_MODEL_API_URL");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": Config.get("APP_MODEL_API_TOKEN"),
      },
      body: JSON.stringify({
        features: [...data.answer],
      }),
    });

    if (!response.ok) {
      logger.error(
        "error from ml model: ",
        response.status,
        await response.text()
      );
      throw new ResponseError(response.status, "error from ml model");
    }

    const json = await response.json();

    return { jurusan: String(json.prediction) };
  }
}
