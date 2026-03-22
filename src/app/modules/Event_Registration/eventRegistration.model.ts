import mongoose, { Schema } from "mongoose";
import { IEventRegistration } from "./eventRegistration.interface";

const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    clubId: { 
      type: String,
      required: true,
    },
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
      enum: ["registered", "cancelled"], 
      default: "registered",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "eventRegistration",
  }
);

export const EventRegistration = mongoose.model<IEventRegistration>(
  "EventRegistration",
  eventRegistrationSchema
);