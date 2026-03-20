import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createCheckoutSessionValidation = z.object({
  clubId: z.string().min(1),
  clubName: z.string().min(2),
  email: z.string().regex(emailRegex, "Invalid email address"),
  membershipFee: z.number().min(0),
});

export const paymentSuccessValidation = z.object({
  session_id: z.string().min(1, "Session ID is required"),
});

export const getPaymentByEmailAndClubValidation = z.object({
  email: z.string().regex(emailRegex, "Invalid email address"),
  clubId: z.string(),
});

export const becomeClubManagerValidation = z.object({
  email: z.string().regex(emailRegex, "Invalid email address"),
});