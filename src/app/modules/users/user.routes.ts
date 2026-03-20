import express from "express";
import { UserController } from "./user.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = express.Router();

router.post("/", UserController.createUser);

router.get(
  "/",
  verifyFirebaseToken,
  UserController.getUser,
);

router.get("/role/:email", UserController.getUserRole);

router.patch(
  "/become-club-manager",
  verifyFirebaseToken,
  UserController.becomeClubManager
);

export const UserRoutes = router;
