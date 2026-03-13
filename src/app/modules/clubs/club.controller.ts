import { Request, Response } from "express";
import { ClubService } from "./club.service";

const getClubs = async (req: Request, res: Response) => {
  const { search, sort } = req.query;

  const result = await ClubService.getClubs(
    search as string,
    sort as string
  );

  res.send(result);
};

const getClub = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ClubService.getClubById(id as string);
  res.send(result);
};

const createClub = async (req: Request, res: Response) => {
  const result = await ClubService.createClub(req.body);
  res.send(result);
};

const updateClub = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ClubService.updateClub(id as string, req.body);
  res.send(result);
};

export const ClubController = {
  getClubs,
  getClub,
  createClub,
  updateClub,
};