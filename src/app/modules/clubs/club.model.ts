import mongoose, { Schema } from "mongoose";
import { IClub } from "./club.interface";

const clubSchema = new Schema<IClub>({
  clubName: {
    type: String,
    required: true,
  },
  clubDescription: {
    type: String,
  },
  membershipFee: {
    type: Number,
    default: 0,
  },
  managerEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

export const Club = mongoose.model<IClub>("Club", clubSchema);