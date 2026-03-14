import { Response } from "express"
import { ApiResponse } from "./ApiResponse"
import { HttpStatus } from "./HttpStatus"

export const sendCreated = <T>(res: Response, data: T, message?: string) => {
  return res
    .status(HttpStatus.CREATED)
    .json(ApiResponse.success(data, message))
}

export const sendOk = <T>(res: Response, data: T) => {
  return res
    .status(HttpStatus.OK)
    .json(ApiResponse.success(data))
}