import express from "express";
import { ClubController } from "./club.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import { createClubValidation, updateClubValidation } from "./club.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get("/", ClubController.getClubs);
router.get("/latest-clubs", ClubController.getLatestClubs);
router.get("/:id", ClubController.getClub);
router.post(
  "/",
  verifyFirebaseToken,
  validateRequest(createClubValidation),
  ClubController.createClub,
);
router.patch(
  "/:id",
  verifyFirebaseToken,
  validateRequest(updateClubValidation),
  ClubController.updateClub,
);

export const ClubRoutes = router;
