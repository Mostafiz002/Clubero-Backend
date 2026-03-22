import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

const memberOverview = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getMemberOverview(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member overview retrieved successfully",
    data,
  });
});

const upcomingEvents = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getUpcomingEvents(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Upcoming events retrieved successfully",
    data,
  });
});

const myClubs = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getMyClubs(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My clubs retrieved successfully",
    data,
  });
});

const myEvents = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getMyEvents(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My events retrieved successfully",
    data,
  });
});

const managerOverview = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getManagerOverview(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Manager overview retrieved successfully",
    data,
  });
});

const managerClubs = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getManagerClubs(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Manager clubs retrieved successfully",
    data,
  });
});

const clubMembers = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getClubMembers(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Club members retrieved successfully",
    data,
  });
});

const managerEvents = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) throw new AppError(401, "Unauthorized");

  const data = await DashboardService.getManagerEvents(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Manager events retrieved successfully",
    data,
  });
});

const eventRegisteredMembers = catchAsync(
  async (req: Request, res: Response) => {
    const email = req.token_email;

    if (!email) throw new AppError(401, "Unauthorized");

    const data = await DashboardService.getEventRegisteredMembers(email);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Event registered members retrieved successfully",
      data,
    });
  }
);

const updateMemberStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.query as { status: string };

    if (!id || !status) {
      throw new AppError(400, "Invalid request");
    }

    const data = await DashboardService.updateMemberStatus(id as string, status);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Member status updated successfully",
      data,
    });
  }
);

const adminStats = catchAsync(async (_req: Request, res: Response) => {
  const data = await DashboardService.getAdminStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin stats retrieved successfully",
    data,
  });
});

export const DashboardController = {
  memberOverview,
  upcomingEvents,
  myClubs,
  myEvents,
  managerOverview,
  managerClubs,
  clubMembers,
  managerEvents,
  eventRegisteredMembers,
  updateMemberStatus,
  adminStats,
};