import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../common/AppError';

export function errorHandlerMiddleware(
  err:Error,
  _req:Request,
  res:Response,
  _next: NextFunction
): void {

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Invalid JSON payload'
    });

    return;
  }
  
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