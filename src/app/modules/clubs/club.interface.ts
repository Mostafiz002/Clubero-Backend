import { Types } from "mongoose";

export interface IClub {
  _id?: Types.ObjectId;
  clubName: string;
  clubDescription: string;
  membershipFee: number;
  managerEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}