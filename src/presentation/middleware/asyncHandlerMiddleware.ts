import { NextFunction, Response } from "express";
import { ParsedQs } from "qs";
import { TypedHandler, TypedRequest, TypedResponse } from "../types/http";

export function asyncHandlerMiddleware<
  TBody = unknown,
  TParams = Record<string, any>,
  TQuery extends ParsedQs = ParsedQs,
  TRes = unknown
>(
  fn: TypedHandler<TBody, TParams, TQuery, TRes>
) {
  return (
    req: TypedRequest<TBody, TParams, TQuery>,
    res: TypedResponse<TRes>,
    next: NextFunction
  ): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}