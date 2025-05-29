import { Validation } from "../../src/validation/validation";
import { RecommendationService } from "../../src/service/recommendation-service";
import { mock, MockProxy } from "jest-mock-extended";
import { MlModelGateway } from "../../src/gateway/ml-model-gateway";
import { RecommendationRequest } from "../../src/dto/recommendation-dto";
import { ResponseError } from "../../src/error/response-error";
import { RecommendationRepository } from "../../src/repository/recommendation-repository";

describe("RecommendationService tests", () => {
  let validation: Validation;
  let mlModelGateway: MockProxy<MlModelGateway>;
  let recommendationRepository: MockProxy<RecommendationRepository>;
  let recommendationService: RecommendationService;

  beforeAll(() => {
    validation = new Validation();
    mlModelGateway = mock<MlModelGateway>();
    recommendationRepository = mock<RecommendationRepository>();
    recommendationService = new RecommendationService(
      validation,
      mlModelGateway,
      recommendationRepository
    );
  });

  it("should success return major recommendations", async () => {
    mlModelGateway.predict.mockResolvedValue({
      jurusan: "Ilmu komunikasi",
    });

    const request: RecommendationRequest = {
      username: "johndoe",
      answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 1],
    };

    const response = await recommendationService.getRecommendation(request);

    const givenRequestToGateway = mlModelGateway.predict.mock.calls[0][0];
    const givenRequestToRepository =
      recommendationRepository.insert.mock.calls[0][0];

    expect(response.jurusan).toEqual("Ilmu komunikasi");
    expect(givenRequestToGateway).toEqual({ answer: request.answer });
    expect(givenRequestToRepository).toEqual({
      userUsername: request.username,
      result: response.jurusan,
    });
  });

  it("should be failed because answer array length less than 12", async () => {
    const request: RecommendationRequest = {
      username: "johndoe",
      answer: [1, 2, 3, 4, 5, 2, 3, 4, 5],
    };

    expect(() =>
      recommendationService.getRecommendation(request)
    ).rejects.toThrow(ResponseError);
  });

  it("should be failed because one of value array greater than 5", async () => {
    const request: RecommendationRequest = {
      username: "johndoe",
      answer: [1, 2, 3, 4, 5, 2, 3, 4, 5, 5, 2, 6],
    };

    expect(() =>
      recommendationService.getRecommendation(request)
    ).rejects.toThrow(ResponseError);
  });
});
