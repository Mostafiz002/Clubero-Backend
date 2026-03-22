import { Request, Response } from "express";
import { ClubService } from "./club.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

// Get all clubs
const getClubs = catchAsync(async (req: Request, res: Response) => {
  const { search, sort } = req.query;

  const result = await ClubService.getClubs(
    search as string,
    sort as string
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Clubs retrieved successfully",
    data: result,
  });
});

// Get single club
const getClub = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ClubService.getClubById(id as string);

  if (!result) {
    throw new AppError(404, "Club not found");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Club retrieved successfully",
    data: result,
  });
});

// Create club
const createClub = catchAsync(async (req: Request, res: Response) => {
  const result = await ClubService.createClub(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Club created successfully",
    data: result,
  });
});

// Update club
const updateClub = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ClubService.updateClub(id as string, req.body);

  if (!result) {
    throw new AppError(404, "Club not found for update");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Club updated successfully",
    data: result,
  });
});

// Get latest clubs
const getLatestClubs = catchAsync(async (_req: Request, res: Response) => {
  const result = await ClubService.getLatestClubs();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Latest clubs retrieved successfully",
    data: result,
  });
});

export const ClubController = {
  getClubs,
  getClub,
  createClub,
  updateClub,
  getLatestClubs,
};