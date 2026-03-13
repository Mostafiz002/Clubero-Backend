import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      token_email?: string;
    }
  }
}

export {};