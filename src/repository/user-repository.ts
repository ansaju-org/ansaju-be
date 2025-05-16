import { User } from "../entity/user";

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  insert(user: User): Promise<void>;
}
