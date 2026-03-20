import express from "express";
import { UserController } from "./user.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import validateRequest from "../../middleware/validateRequest";
import { createUserValidation, getUserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(createUserValidation),
  UserController.createUser,
);

router.get(
  "/",
  verifyFirebaseToken,
  validateRequest(getUserValidation),
  UserController.getUser,
);

router.get("/role/:email", UserController.getUserRole);

export const UserRoutes = router;
