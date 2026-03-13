import express from "express";
import { EventController } from "./event.controller";

const router = express.Router();

router.get("/", EventController.getEvents);
router.get("/:id", EventController.getEvent);
router.post("/", EventController.createEvent);
router.patch("/:id", EventController.updateEvent);
router.delete("/:id", EventController.deleteEvent);

export const EventRoutes = router;