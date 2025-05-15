import { User } from "../entity/user";

export interface UserRepository {
  findByUsername(username: string): Promise<User | undefined>;
  insert(user: User): Promise<void>;
}
