import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
  memberOverview: async (req: Request, res: Response) => {
    const email = req.token_email; // make sure you typed this in a middleware
    const data = await DashboardService.getMemberOverview(email as string);
    res.send(data);
  },

  upcomingEvents: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getUpcomingEvents(email as string);
    res.send(data);
  },

  myClubs: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getMyClubs(email as string);
    res.send(data);
  },

  myEvents: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getMyEvents(email as string);
    res.send(data);
  },

  managerOverview: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getManagerOverview(email as string);
    res.send(data);
  },

  managerClubs: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getManagerClubs(email as string);
    res.send(data);
  },

  clubMembers: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getClubMembers(email as string);
    res.send(data);
  },

  managerEvents: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getManagerEvents(email as string);
    res.send(data);
  },

  eventRegisteredMembers: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await DashboardService.getEventRegisteredMembers(email as string);
    res.send(data);
  },

  updateMemberStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.query as { status: string };
    const data = await DashboardService.updateMemberStatus(id as string, status);
    res.send(data);
  },

  adminStats: async (req: Request, res: Response) => {
    const data = await DashboardService.getAdminStats();
    res.send(data);
  },
};