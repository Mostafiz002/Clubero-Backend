import { Request, Response, NextFunction } from "express";
import { User } from "../modules/users/user.model";

const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.token_email;

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "forbidden access" });
    }

    next();
  } catch {
    return res.status(500).send({ message: "authorization failed" });
  }
};

export default verifyAdmin;