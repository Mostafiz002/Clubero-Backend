import express from "express";
import { MembershipController } from "./membership.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = express.Router();

router.post("/",verifyFirebaseToken, MembershipController.createMembership);
router.get("/club",verifyFirebaseToken, MembershipController.getMembershipByClub);

export const MembershipRoutes = router;