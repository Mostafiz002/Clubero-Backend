import { Request, Response } from "express";
import { EventRegistrationService } from "./eventRegistration.service";

const getEventRegistration = async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const email = req.query.email as string;

  if (!eventId || !email) {
    return res.status(400).send({ message: "Invalid request" });
  }

  const result = await EventRegistrationService.getEventRegistration(
    eventId as string,
    email
  );

  res.send(result || null);
};

const createEventRegistration = async (req: Request, res: Response) => {
  const result = await EventRegistrationService.createEventRegistration(
    req.body
  );

  res.send(result);
};

export const EventRegistrationController = {
  getEventRegistration,
  createEventRegistration,
};