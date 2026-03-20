import { Types } from "mongoose";

export interface IMembership {
  _id?: Types.ObjectId;
  clubId: string;
  clubName: string;
  email: string;
  membershipFee: number;
  status: string;
  joinedAt?: Date;
  transactionId?: string;
}