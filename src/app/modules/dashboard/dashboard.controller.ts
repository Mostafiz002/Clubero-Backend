import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const memberOverview = async (req: Request, res: Response) => {
  const email = req.token_email; 
  const data = await DashboardService.getMemberOverview(email as string);
  res.send(data);
};

const upcomingEvents = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getUpcomingEvents(email as string);
  res.send(data);
};

const myClubs = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getMyClubs(email as string);
  res.send(data);
};

const myEvents = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getMyEvents(email as string);
  res.send(data);
};

const managerOverview = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getManagerOverview(email as string);
  res.send(data);
};

const managerClubs = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getManagerClubs(email as string);
  res.send(data);
};

const clubMembers = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getClubMembers(email as string);
  res.send(data);
};

const managerEvents = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getManagerEvents(email as string);
  res.send(data);
};

const eventRegisteredMembers = async (req: Request, res: Response) => {
  const email = req.token_email;
  const data = await DashboardService.getEventRegisteredMembers(email as string);
  res.send(data);
};

const updateMemberStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.query as { status: string };
  const data = await DashboardService.updateMemberStatus(id as string, status);
  res.send(data);
};

const adminStats = async (req: Request, res: Response) => {
  const data = await DashboardService.getAdminStats();
  res.send(data);
};

export const DashboardController = {
  memberOverview,
  upcomingEvents,
  myClubs,
  myEvents,
  managerOverview,
  managerClubs,
  clubMembers,
  managerEvents,
  eventRegisteredMembers,
  updateMemberStatus,
  adminStats,
};