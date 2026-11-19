import { Request, Response, NextFunction } from "express";
import { generateImageKitAuth } from "../services/imagekit.service.js";

export function handleGetImageKitAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authParams = generateImageKitAuth();

    res.status(200).json({
      success: true,
      data: authParams,
    });
  } catch (error) {
    next(error);
  }
}
