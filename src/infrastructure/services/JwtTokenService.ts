import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";
import { config } from "../../config";
import { AppError } from "../../shared/AppError";
import { ITokenService, TokenPayload } from "../../application/interfaces";

@injectable()
export class JwtTokenService implements ITokenService {
  generate(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
    });
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      if (typeof decoded === "string") {
        throw AppError.unauthorized("Invalid token");
      }

      const userId = decoded.userId;
      const email = decoded.email;

      if (typeof userId !== "string" || typeof email !== "string") {
        throw AppError.unauthorized("Invalid token payload");
      }

      return { userId, email };
    } catch {
      throw AppError.unauthorized("Invalid or expired token");
    }
  }
}