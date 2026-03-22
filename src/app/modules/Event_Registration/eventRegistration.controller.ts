import { Request, Response } from "express";
import { EventRegistrationService } from "./eventRegistration.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

const getEventRegistration = catchAsync(async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const email = req.query.email as string;

  if (!eventId || !email) {
    throw new AppError(400, "Invalid request");
  }

  const result = await EventRegistrationService.getEventRegistration(
    eventId as string,
    email
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event registration retrieved successfully",
    data: result || null,
  });
});

const createEventRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await EventRegistrationService.createEventRegistration(
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Event registration created successfully",
    data: result,
  });
});

export const EventRegistrationController = {
  getEventRegistration,
  createEventRegistration,
};