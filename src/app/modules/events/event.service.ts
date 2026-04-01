import { Event } from "./event.model";
import { cacheWrapper } from "../../utils/cacheWrapper";
import { invalidateCache } from "../../utils/invalidateCache";

const getEvents = async (search?: string, limit?: number) => {
  const cacheKey = `events:${search || "all"}:${limit || "all"}`;

  return cacheWrapper(
    cacheKey,
    async () => {
      const query: any = {};

      if (search) {
        query.title = { $regex: search, $options: "i" };
      }

      return Event.find(query)
        .sort({ createdAt: -1 })
        .limit(limit || 0);
    },
    60,
  );
};

const getEventById = async (id: string) => {
  return Event.findById(id);
};

const createEvent = async (payload: any) => {
  payload.createdAt = new Date();
  const event = await Event.create(payload);

  await invalidateCache("events:*");

  return event;
};

const updateEvent = async (id: string, payload: any) => {
  const updatedEvent = await Event.findByIdAndUpdate(id, payload, {
    new: true,
  });

  await invalidateCache("events:*");

  return updatedEvent;
};

const deleteEvent = async (id: string) => {
  const deletedEvent = await Event.findByIdAndDelete(id);

  await invalidateCache("events:*");

  return deletedEvent;
};

export const EventService = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
