import mongoose, { Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    customerEmail: { type: String, required: true },
    clubId: { type: String, required: true },
    clubName: { type: String, required: true },
    transactionId: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paidAt: { type: Date, default: Date.now },
  },
  {
    collection: "payments",
  }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);