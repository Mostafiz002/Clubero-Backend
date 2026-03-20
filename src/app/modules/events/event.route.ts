import express from "express";
import { EventController } from "./event.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import {
  createEventValidation,
  updateEventValidation,
} from "./event.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get("/", EventController.getEvents);
router.get("/:id", EventController.getEvent);
router.post(
  "/",
  verifyFirebaseToken,
  validateRequest(createEventValidation),
  EventController.createEvent,
);
router.patch(
  "/:id",
  verifyFirebaseToken,
  validateRequest(updateEventValidation),
  EventController.updateEvent,
);
router.delete("/:id", verifyFirebaseToken, EventController.deleteEvent);

export const EventRoutes = router;
