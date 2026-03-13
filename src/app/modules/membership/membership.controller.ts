import { Request, Response } from "express";
import { MembershipService } from "./membership.service";

const createMembership = async (req: Request, res: Response) => {
  const result = await MembershipService.createMembership(req.body);
  res.send(result);
};

const getMembershipByClub = async (req: Request, res: Response) => {
  const { clubId, email } = req.query;

  if (!clubId || !email) {
    return res.status(400).send({ message: "Invalid request" });
  }

  const result = await MembershipService.getMembershipByClub(
    clubId as string,
    email as string
  );

  res.send(result);
};

export const MembershipController = {
  createMembership,
  getMembershipByClub,
};