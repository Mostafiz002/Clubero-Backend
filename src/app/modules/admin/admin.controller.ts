import { Request, Response } from "express";
import { AdminService } from "./admin.service";

export const AdminController = {
  getUsers: async (req: Request, res: Response) => {
    const { searchText } = req.query as { searchText?: string };
    const data = await AdminService.getAllUsers(searchText);
    res.send(data);
  },

  updateUserRole: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.query as { role: string };
    const data = await AdminService.updateUserRole(id as string, role);
    res.send(data);
  },

  getCMAppliedUsers: async (_req: Request, res: Response) => {
    const data = await AdminService.getCMAppliedUsers();
    res.send(data);
  },

  updateCMStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { becomeCM } = req.query as { becomeCM: string };
    const data = await AdminService.updateCMStatus(id as string, becomeCM);
    res.send(data);
  },

  getClubs: async (_req: Request, res: Response) => {
    const data = await AdminService.getAllClubs();
    res.send(data);
  },

  updateClubStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.query as { status: string };
    const data = await AdminService.updateClubStatus(id as string, status);
    res.send(data);
  },

  getPayments: async (_req: Request, res: Response) => {
    const data = await AdminService.getPayments();
    res.send(data);
  },
};