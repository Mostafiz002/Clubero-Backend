import express from "express";
import { EventRegistrationController } from "./eventRegistration.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import { createEventRegistrationValidation } from "./eventRegistration.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get("/:id", EventRegistrationController.getEventRegistration);
router.post(
  "/",
  verifyFirebaseToken,
  validateRequest(createEventRegistrationValidation),
  EventRegistrationController.createEventRegistration,
);

export const EventRegistrationRoutes = router;
