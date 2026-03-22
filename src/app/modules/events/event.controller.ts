import { Request, Response } from "express";
import { EventService } from "./event.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

// Get all events
const getEvents = catchAsync(async (req: Request, res: Response) => {
  const { search, limit } = req.query;

  const result = await EventService.getEvents(
    search as string,
    limit ? Number(limit) : undefined
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Events retrieved successfully",
    data: result,
  });
});

// Get single event
const getEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getEventById(req.params.id as string);

  if (!result) {
    throw new AppError(404, "Event not found");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event retrieved successfully",
    data: result,
  });
});

// Create event
const createEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.createEvent(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

// Update event
const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.updateEvent(
    req.params.id as string,
    req.body
  );

  if (!result) {
    throw new AppError(404, "Event not found for update");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event updated successfully",
    data: result,
  });
});

// Delete event
const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.deleteEvent(req.params.id as string);

  if (!result) {
    throw new AppError(404, "Event not found for deletion");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event deleted successfully",
    data: result,
  });
});

export const EventController = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};