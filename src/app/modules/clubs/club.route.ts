import express from "express";
import { ClubController } from "./club.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = express.Router();

router.get("/", ClubController.getClubs);
router.get("/latest-clubs", ClubController.getLatestClubs);
router.get("/:id", ClubController.getClub);
router.post("/", verifyFirebaseToken, ClubController.createClub);
router.patch("/:id", verifyFirebaseToken, ClubController.updateClub);

export const ClubRoutes = router;
