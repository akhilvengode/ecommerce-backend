import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma errors (basic handling)
  if (err.code === "P2002") {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};