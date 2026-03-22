import { RequestHandler, NextFunction, Request, Response } from "express";
import { TypedHandler } from "../Common/http/http";

export function asyncHandlerMiddleware<
  TBody = unknown,
  TParams extends Record<string, any> = Record<string, any>,
  TQuery extends Record<string, any> = Record<string, any>,
  TRes = unknown
>(
  fn: TypedHandler<TBody, TParams, TQuery, TRes>
): RequestHandler<TParams, TRes, TBody, TQuery> {
  return (req: Request<TParams, TRes, TBody, TQuery>, res: Response<TRes>, next: NextFunction) => {
    Promise.resolve(fn(req as any, res as any, next)).catch(next);
  };
}