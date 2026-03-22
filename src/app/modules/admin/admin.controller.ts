import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getUsers = async (req: Request, res: Response) => {
  const { searchText } = req.query as { searchText?: string };
  const data = await AdminService.getAllUsers(searchText);
  res.send(data);
};

const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.query as { role: string };
  const data = await AdminService.updateUserRole(id as string, role);
  res.send(data);
};

const getCMAppliedUsers = async (_req: Request, res: Response) => {
  const data = await AdminService.getCMAppliedUsers();
  res.send(data);
};

const updateCMStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { becomeCM } = req.query as { becomeCM: string };
  const data = await AdminService.updateCMStatus(id as string, becomeCM);
  res.send(data);
};

const getClubs = async (_req: Request, res: Response) => {
  const data = await AdminService.getAllClubs();
  res.send(data);
};

const updateClubStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.query as { status: string };
  const data = await AdminService.updateClubStatus(id as string, status);
  res.send(data);
};

const getPayments = async (_req: Request, res: Response) => {
  const data = await AdminService.getPayments();
  res.send(data);
};

export const AdminController = {
  getUsers,
  updateUserRole,
  getCMAppliedUsers,
  updateCMStatus,
  getClubs,
  updateClubStatus,
  getPayments,
};