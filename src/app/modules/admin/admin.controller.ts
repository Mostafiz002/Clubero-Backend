import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { searchText } = req.query as { searchText?: string };

  const data = await AdminService.getAllUsers(searchText);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.query as { role: string };

  if (!id || !role) {
    throw new AppError(400, "Invalid request");
  }

  const data = await AdminService.updateUserRole(id as string, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data,
  });
});

const getCMAppliedUsers = catchAsync(async (_req: Request, res: Response) => {
  const data = await AdminService.getCMAppliedUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "CM applied users retrieved successfully",
    data,
  });
});

const updateCMStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { becomeCM } = req.query as { becomeCM: string };

  if (!id || !becomeCM) {
    throw new AppError(400, "Invalid request");
  }

  const data = await AdminService.updateCMStatus(id as string, becomeCM);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "CM status updated successfully",
    data,
  });
});

const getClubs = catchAsync(async (_req: Request, res: Response) => {
  const data = await AdminService.getAllClubs();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Clubs retrieved successfully",
    data,
  });
});

const updateClubStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.query as { status: string };

  if (!id || !status) {
    throw new AppError(400, "Invalid request");
  }

  const data = await AdminService.updateClubStatus(id as string, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Club status updated successfully",
    data,
  });
});

const getPayments = catchAsync(async (_req: Request, res: Response) => {
  const data = await AdminService.getPayments();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments retrieved successfully",
    data,
  });
});

export const AdminController = {
  getUsers,
  updateUserRole,
  getCMAppliedUsers,
  updateCMStatus,
  getClubs,
  updateClubStatus,
  getPayments,
};