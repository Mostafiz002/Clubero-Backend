import { z } from "zod";

export const createEventValidation = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  clubId: z.string().min(1, "Club ID is required"),
  eventDate: z.coerce.date(),
  location: z.string().optional(),
  isPaid: z.boolean().optional(),
  eventFee: z.coerce.number().min(0).optional(),
  bannerImage: z.string().optional(),
});

export const updateEventValidation = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  eventDate: z.coerce.date().optional(),
  location: z.string().optional(),
  isPaid: z.boolean().optional(),
  eventFee: z.coerce.number().min(0).optional(),
  bannerImage: z.string().optional(),
});
