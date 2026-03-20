import { Request, Response, NextFunction } from "express";
import admin from "../config/firebase";

const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  try {
    const userInfo = await admin.auth().verifyIdToken(token);

    req.token_email = userInfo.email;

    next();
  } catch {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

export default verifyFirebaseToken;