import express from "express";
import { MembershipController } from "./membership.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import { createMembershipValidation } from "./membership.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.post(
  "/",
  verifyFirebaseToken,
  validateRequest(createMembershipValidation),
  MembershipController.createMembership,
);
router.get(
  "/club",
  verifyFirebaseToken,
  MembershipController.getMembershipByClub,
);

export const MembershipRoutes = router;
