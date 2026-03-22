import { Request, Response } from "express";
import { MembershipService } from "./membership.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

const createMembership = catchAsync(async (req: Request, res: Response) => {
  const result = await MembershipService.createMembership(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Membership created successfully",
    data: result,
  });
});

const getMembershipByClub = catchAsync(
  async (req: Request, res: Response) => {
    const { clubId, email } = req.query;

    if (!clubId || !email) {
      throw new AppError(400, "Invalid request");
    }

    const result = await MembershipService.getMembershipByClub(
      clubId as string,
      email as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Membership retrieved successfully",
      data: result,
    });
  }
);

export const MembershipController = {
  createMembership,
  getMembershipByClub,
};