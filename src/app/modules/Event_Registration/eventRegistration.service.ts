import { EventRegistration } from "./eventRegistration.model";

const getEventRegistration = async (eventId: string, email: string) => {
  return EventRegistration.findOne({
    eventId,
    email,
  });
};

const createEventRegistration = async (payload: any) => {
  payload.status = "registered";
  payload.registeredAt = new Date();

  return EventRegistration.create(payload);
};

export const EventRegistrationService = {
  getEventRegistration,
  createEventRegistration,
};