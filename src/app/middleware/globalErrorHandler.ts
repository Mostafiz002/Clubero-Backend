import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import mongoose from "mongoose";
import Stripe from "stripe";
import AppError from "../utils/appErrors";

const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("❌ ERROR =>", err);
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails: any = null;

  /* -------------------- Zod Error -------------------- */
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";

    errorDetails = err.issues.map((e) => ({
      path: e.path.join(".") || "body",
      message: e.message,
    }));
  }

  /* -------------------- Mongoose Validation -------------------- */
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Mongoose Validation Error";

    errorDetails = Object.values(err.errors).map((e: any) => ({
      path: e.path,
      message: e.message,
    }));
  }

  /* -------------------- Mongo Duplicate Key -------------------- */
  else if (err.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    message = "Duplicate field value";

    const field = Object.keys(err.keyValue)[0];
    errorDetails = `${field} already exists`;
  }

  /* -------------------- Cast Error (Invalid ObjectId) -------------------- */
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = `Invalid ${err.path}`;
  }

  /* -------------------- Stripe Error -------------------- */
  else if (err instanceof Stripe.errors.StripeError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;
  }

  /* -------------------- Custom App Error -------------------- */
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  /* -------------------- Generic Error -------------------- */
  else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR; // ✅ FIXED
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    stack: isDev ? err.stack : undefined,
  });
};

export default globalErrorHandler;