import { z } from "zod";

export const createEventValidation = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),

  clubId: z.string().min(1, "Club ID is required"),

  eventDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
});

export const updateEventValidation = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  eventDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
});