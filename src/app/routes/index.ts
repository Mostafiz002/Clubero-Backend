import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { ClubRoutes } from "../modules/clubs/club.route";
import { EventRoutes } from "../modules/events/event.route";
import { EventRegistrationRoutes } from "../modules/Event_Registration/eventRegistration.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/clubs", ClubRoutes);
router.use("/events", EventRoutes);
router.use("/eventRegistration", EventRegistrationRoutes);

export default router;
