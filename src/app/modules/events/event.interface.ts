import { Types } from "mongoose";

export interface IEvent {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  clubId: string;
  eventDate: Date;
  createdAt?: Date;
}