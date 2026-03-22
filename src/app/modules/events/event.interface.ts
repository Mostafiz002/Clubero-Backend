import { Types } from "mongoose";

export interface IEvent {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  clubId: string;
  eventDate: Date;
  location?: string;
  isPaid?: boolean;
  eventFee?: number;
  bannerImage?: string;
  createdAt?: Date;
}
