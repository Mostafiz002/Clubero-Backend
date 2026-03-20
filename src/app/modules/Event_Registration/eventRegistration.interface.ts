import { Types } from "mongoose";

export interface IEventRegistration {
  _id?: Types.ObjectId;
  eventId: string;
  email: string;
  status?: string;
  registeredAt?: Date;
}