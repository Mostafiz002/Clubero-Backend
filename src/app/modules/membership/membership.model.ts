import mongoose, { Schema } from "mongoose";
import { IMembership } from "./membership.interface";

const membershipSchema = new Schema<IMembership>(
  {
    clubId: {
      type: String,
      required: true,
    },

    clubName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    membershipFee: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "active",
    },

    transactionId: {
      type: String,
      default: "none",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "membership",
  }
);

export const Membership = mongoose.model<IMembership>(
  "Membership",
  membershipSchema
);