import express from "express";
import { ClubController } from "./club.controller";

const router = express.Router();

router.get("/", ClubController.getClubs);
router.get("/:id", ClubController.getClub);
router.post("/", ClubController.createClub);
router.patch("/:id", ClubController.updateClub);

export const ClubRoutes = router;