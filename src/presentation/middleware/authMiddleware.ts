import { RequestHandler } from "express";
import { container } from "tsyringe";
import { ITokenService } from "../../application/interfaces";
import { TOKENS } from "../../domain/tokens";
import { AppError } from "../../shared/AppError";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Unauthorized"));
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return next(AppError.unauthorized("Missing token"));
  }

  const tokenService = container.resolve<ITokenService>(TOKENS.TokenService);
  const payload = tokenService.verify(token);

  req.userId = payload.userId;
  req.userEmail = payload.email;

  return next();
};