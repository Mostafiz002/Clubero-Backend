import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "admin" | "member" | "manager";
  becomeCM?: "none" | "applied" | "approved" | "rejected";
  createdAt?: Date;
}