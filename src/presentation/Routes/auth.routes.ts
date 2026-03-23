import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../Controllers/AuthController";
import { validate } from "../Middleware/validateMiddleware";
import { asyncHandlerMiddleware } from "../Middleware/asyncHandlerMiddleware";
import { loginSchema, registerSchema } from "../Validators/authValidators";

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