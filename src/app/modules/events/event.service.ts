import { Event } from "./event.model";

const getEvents = async (search?: string, limit?: number) => {
  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  return Event.find(query)
    .sort({ createdAt: -1 })
    .limit(limit || 0);
};

const getEventById = async (id: string) => {
  return Event.findById(id);
};

const createEvent = async (payload: any) => {
  payload.createdAt = new Date();
  return Event.create(payload);
};

const updateEvent = async (id: string, payload: any) => {
  return Event.findByIdAndUpdate(id, payload, { new: true });
};

const deleteEvent = async (id: string) => {
  return Event.findByIdAndDelete(id);
};

export const EventService = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};