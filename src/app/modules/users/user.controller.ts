import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createUser(req.body);
    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to add user" });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;

    if (!email) {
      return res.send({ message: "Failed to get user" });
    }

    const result = await UserService.getUserByEmail(email);

    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to get user" });
  }
};

const getUserRole = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;

    const result = await UserService.getUserRole(email as string);

    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to get user role" });
  }
};



export const UserController = {
  createUser,
  getUser,
  getUserRole,
};
