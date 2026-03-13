import mongoose, { Schema } from "mongoose";
import { IEvent } from "./event.interface";

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  description: String,

  clubId: {
    type: String,
    required: true,
  },

  eventDate: {
    type: Date,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Event = mongoose.model<IEvent>("Event", eventSchema);