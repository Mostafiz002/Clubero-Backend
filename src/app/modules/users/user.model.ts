import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "member", "manager"],
      default: "member",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
