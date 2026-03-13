import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { ClubRoutes } from "../modules/clubs/club.route";
import { EventRoutes } from "../modules/events/event.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/clubs", ClubRoutes);
router.use("/events", EventRoutes);

export default router;
