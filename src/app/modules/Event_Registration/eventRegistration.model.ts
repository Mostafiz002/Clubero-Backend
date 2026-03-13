import mongoose, { Schema } from "mongoose";
import { IEventRegistration } from "./eventRegistration.interface";

const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "registered",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "eventRegistration",
  },
);

export const EventRegistration = mongoose.model<IEventRegistration>(
  "EventRegistration",
  eventRegistrationSchema,
);
