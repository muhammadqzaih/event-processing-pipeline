import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/AppError';

export function errorHandlerMiddleware(
  err:Error,
  _req:Request,
  res:Response,
  _next: NextFunction
): void {

  if(err instanceof AppError){
    res.status(err.statusCode).json({
      success:false,
      message:err.message
    })

    return;
  }

  console.log("Unhandled error:", err);
  res.status(500).json({
    success:false,
    message:"Internal server error"
  });
}