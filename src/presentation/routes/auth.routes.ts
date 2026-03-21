import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../middleware/validateMiddleware";
import { asyncHandlerMiddleware } from "../middleware/asyncHandlerMiddleware";
import { loginSchema, registerSchema } from "../validators/authValidators";

export function createAuthRouter(): Router {
  const router = Router();
  const controller = container.resolve(AuthController);

  router.post(
    "/register",
    validate({ body: registerSchema }),
    asyncHandlerMiddleware(controller.register),
  );

  router.post(
    "/login",
    validate({ body: loginSchema }),
    asyncHandlerMiddleware(controller.login),
  );

  return router;
}