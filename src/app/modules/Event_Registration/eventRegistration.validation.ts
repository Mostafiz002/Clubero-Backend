import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createEventRegistrationValidation = z.object({
  clubId: z.string().min(1, "Club ID is required"), 
  eventId: z.string().min(1, "Event ID is required"),
  email: z.string().regex(emailRegex, "Invalid email address"),
});
