import { RequestHandler } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { AppError } from "../../shared/AppError";

export function validate<
  TBody = any,
  TParams extends Record<string, any> = Record<string, any>,
  TQuery extends Record<string, any> = Record<string, any>
>(
  schemas: {
    body?: ZodTypeAny;
    params?: ZodTypeAny;
    query?: ZodTypeAny;
  }
): RequestHandler<TParams, any, TBody, TQuery> {
  return (req, _res, next) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as TParams;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as TQuery;
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body) as TBody;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        // PRO FIX: Instead of .join("; "), we take the first error message only.
        // This prevents "Invalid Pipeline ID; Config missing" confusion.
        const firstMessage = err.issues.length > 1 
          ? err.issues[1].message 
          : err.issues[0].message;;
        
        return next(AppError.badRequest(firstMessage));
      }
      return next(err as Error);
    }
  };
}