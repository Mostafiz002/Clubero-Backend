import express from "express";
import { EventRegistrationController } from "./eventRegistration.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = express.Router();

router.get("/:id", EventRegistrationController.getEventRegistration);
router.post(
  "/",
  verifyFirebaseToken,
  EventRegistrationController.createEventRegistration,
);

export const EventRegistrationRoutes = router;
