import { Validation } from "../../src/validation/validation";
import { RecommendationService } from "../../src/service/recommendation-service";
import { mock, MockProxy } from "jest-mock-extended";
import { MlModelGateway } from "../../src/gateway/ml-model-gateway";
import { RecommendationRequest } from "../../src/dto/recommendation-dto";
import { ResponseError } from "../../src/error/response-error";

describe("RecommendationService tests", () => {
  let validation: Validation;
  let mlModelGateway: MockProxy<MlModelGateway>;
  let recommendationService: RecommendationService;

  beforeAll(() => {
    validation = new Validation();
    mlModelGateway = mock<MlModelGateway>();
    recommendationService = new RecommendationService(
      validation,
      mlModelGateway
    );
  });

  it("should success return major recommendations", async () => {
    mlModelGateway.predict.mockResolvedValue({
      jurusan: "Ilmu komunikasi",
    });

    const request: RecommendationRequest = {
      answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 1],
    };

    const response = await recommendationService.getRecommendation(request);

    const givenRequest = mlModelGateway.predict.mock.calls[0][0];

    expect(response.jurusan).toEqual("Ilmu komunikasi");
    expect(givenRequest).toEqual(request);
  });

  it("should be failed because answer array length less than 12", async () => {
    const request: RecommendationRequest = {
      answer: [1, 2, 3, 4, 5, 2, 3, 4, 5],
    };

    expect(() =>
      recommendationService.getRecommendation(request)
    ).rejects.toThrow(ResponseError);
  });

  it("should be failed because one of value array greater than 5", async () => {
    const request: RecommendationRequest = {
      answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 6],
    };

    expect(() =>
      recommendationService.getRecommendation(request)
    ).rejects.toThrow(ResponseError);
  });
});
