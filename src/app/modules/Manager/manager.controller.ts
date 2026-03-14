import { Request, Response } from "express";
import { ManagerService } from "./manager.service";

export const ManagerController = {
  getClubs: async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string || req.token_email;
      const result = await ManagerService.getClubs(email as string);
      res.send(result);
    } catch {
      res.status(500).send({ message: "Failed to load clubs" });
    }
  },

  getClubMembers: async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string || req.token_email;
      const result = await ManagerService.getClubMembers(email as string);
      res.send(result);
    } catch {
      res.status(500).send({ message: "Failed to load members" });
    }
  },

  getEvents: async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string || req.token_email;
      const result = await ManagerService.getEvents(email as string);
      res.send(result);
    } catch {
      res.status(500).send({ message: "Failed to load events" });
    }
  },

  getEventMembers: async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string || req.token_email;
      const result = await ManagerService.getEventMembers(email as string);
      res.send(result);
    } catch {
      res.status(500).send({ message: "Failed to load event registrations" });
    }
  },
};