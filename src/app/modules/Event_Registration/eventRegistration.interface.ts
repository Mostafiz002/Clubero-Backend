import { Types } from "mongoose";

export interface IEventRegistration {
  _id?: Types.ObjectId;
  clubId: string; 
  eventId: string;
  email: string;
  status?: "registered" | "cancelled"; 
  registeredAt?: Date;
}