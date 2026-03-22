import mongoose, { Schema } from "mongoose";
import { IClub } from "./club.interface";

const clubSchema = new Schema<IClub>({
  clubName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  category: {
    type: String,
  },

  location: {
    type: String,
  },

  bannerImage: {
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

  managerName: {
    type: String,
  },

  managerImage: {
    type: String,
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

  updatedAt: {
    type: Date,
  },
});

export const Club = mongoose.model<IClub>("Club", clubSchema);