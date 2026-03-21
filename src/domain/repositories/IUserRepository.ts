import { User } from "../entities";

export interface IUserRepository {
  create(data: { name: string; email: string; password: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}