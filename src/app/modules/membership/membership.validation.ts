import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createMembershipValidation = z.object({
  clubId: z.string().min(1, "Club ID is required"),
  clubName: z.string().min(2, "Club name is required"),
  email: z.string().regex(emailRegex, "Invalid email address"),
});

export const getMembershipByClubValidation = z.object({
  clubId: z.string(),
  email: z.string().regex(emailRegex, "Invalid email address"),
});