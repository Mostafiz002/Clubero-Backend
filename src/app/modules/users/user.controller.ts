import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const email = req.query.email as string;

  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const result = await UserService.getUserByEmail(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result || null,
  });
});

const getUserRole = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;

  if (!email) {
    throw new AppError(400, "Email param is required");
  }

  const result = await UserService.getUserRole(email as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role retrieved successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getUser,
  getUserRole,
};