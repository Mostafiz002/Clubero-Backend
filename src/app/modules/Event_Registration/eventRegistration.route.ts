import express from "express";
import { EventRegistrationController } from "./eventRegistration.controller";

const router = express.Router();

router.get("/:id", EventRegistrationController.getEventRegistration);
router.post("/", EventRegistrationController.createEventRegistration);

export const EventRegistrationRoutes = router;