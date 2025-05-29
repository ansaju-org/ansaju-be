import { MlModelGateway } from "../../src/gateway/ml-model-gateway";
import { HttpMlModelGateway } from "../../src/gateway/http-ml-model-gateway";

// this is integration test, machine learning server must be running
describe("HttpMlModelGateway tests", () => {
  let mlModelGateway: MlModelGateway;

  beforeAll(() => {
    mlModelGateway = new HttpMlModelGateway();
  });

  it("should be get recommendation successfully", async () => {
    const response = await mlModelGateway.predict({
      answer: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    });

    console.log(response);
  });
});
