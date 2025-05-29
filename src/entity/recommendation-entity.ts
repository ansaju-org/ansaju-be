export class RecommendationEntity {
  readonly id?: number;
  readonly createdAt?: Date;
  constructor(public result: string, public userUsername: string) {}
}
