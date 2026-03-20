import express from "express";
import { EventController } from "./event.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = express.Router();

router.get("/", EventController.getEvents);
router.get("/:id", EventController.getEvent);
router.post("/", verifyFirebaseToken, EventController.createEvent);
router.patch("/:id", verifyFirebaseToken, EventController.updateEvent);
router.delete("/:id", verifyFirebaseToken, EventController.deleteEvent);

export const EventRoutes = router;
