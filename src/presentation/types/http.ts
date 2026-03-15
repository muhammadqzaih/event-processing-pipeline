import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export type TypedRequest<
  TBody = unknown,
  TParams = ParamsDictionary,
  TQuery extends ParsedQs = ParsedQs,
  TRes = unknown
> = Request<TParams, TRes, TBody, TQuery>;

export type TypedResponse<TRes = unknown> = Response<TRes>;

export type TypedHandler<
  TBody = unknown,
  TParams = ParamsDictionary,
  TQuery extends ParsedQs = ParsedQs,
  TRes = unknown
> = (
  req: TypedRequest<TBody, TParams, TQuery, TRes>,
  res: TypedResponse<TRes>,
  next: NextFunction
) => Promise<void>;

export type BodyHandler<TBody, TRes> =
  TypedHandler<TBody, {}, {}, TRes>;

export type ParamsHandler<TParams, TRes> =
  TypedHandler<unknown, TParams, {}, TRes>;

export type QueryHandler<TQuery extends ParsedQs, TRes> =
  TypedHandler<unknown, {}, TQuery, TRes>;

export type ParamsBodyHandler<TBody, TParams, TRes> =
  TypedHandler<TBody, TParams, {}, TRes>;