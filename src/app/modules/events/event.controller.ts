import { Request, Response } from "express";
import { EventService } from "./event.service";

const getEvents = async (req: Request, res: Response) => {
  const { search, limit } = req.query;

  const result = await EventService.getEvents(search as string, Number(limit));

  res.send(result);
};

const getEvent = async (req: Request, res: Response) => {
  const result = await EventService.getEventById(req.params.id as string);
  res.send(result);
};

const createEvent = async (req: Request, res: Response) => {
  const result = await EventService.createEvent(req.body);
  res.send(result);
};

const updateEvent = async (req: Request, res: Response) => {
  const result = await EventService.updateEvent(
    req.params.id as string,
    req.body,
  );
  res.send(result);
};

const deleteEvent = async (req: Request, res: Response) => {
  const result = await EventService.deleteEvent(req.params.id as string);
  res.send(result);
};

export const EventController = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
