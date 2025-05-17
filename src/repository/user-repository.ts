import { UserEntity } from "../entity/user-entity";

export interface UserRepository {
  findByUsername(username: string): Promise<UserEntity | null>;
  insert(user: UserEntity): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
