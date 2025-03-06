import { Request, Response, NextFunction, RequestHandler } from 'express';

// This is a wrapper function that converts async controller functions to Express request handlers
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 