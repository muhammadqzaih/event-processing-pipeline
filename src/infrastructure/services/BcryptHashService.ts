import bcrypt from "bcryptjs";
import { injectable } from "tsyringe";
import { IHashService } from "../../application/interfaces";

@injectable()
export class BcryptHashService implements IHashService {
  private static readonly SALT_ROUNDS = 12;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, BcryptHashService.SALT_ROUNDS);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}