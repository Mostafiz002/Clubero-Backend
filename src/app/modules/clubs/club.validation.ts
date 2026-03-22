import { z } from "zod";


export const createClubValidation = z.object({
  clubName: z.string().min(2, "Club name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  bannerImage: z.string().optional(),
  membershipFee: z.coerce.number().min(0),
  managerEmail: z.string().email(),
  managerName: z.string().optional(),
  managerImage: z.string().optional(),
});

export const updateClubValidation = z.object({
  clubName: z.string().min(2).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  bannerImage: z.string().optional(),
  membershipFee: z.coerce.number().min(0).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  managerName: z.string().optional(),
  managerImage: z.string().optional(),
});