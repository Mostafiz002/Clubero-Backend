import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createUserValidation = z.object({
  email: z.string().regex(emailRegex, "Invalid email address"),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  photoURL: z.string().url().optional(),
});

export const getUserValidation = z.object({
  email: z.string().regex(emailRegex, "Invalid email address"),
});

export const getUserRoleValidation = z.object({
  email: z.string().regex(emailRegex, "Invalid email address"),
});
