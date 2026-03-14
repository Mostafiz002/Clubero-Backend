import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { ClubRoutes } from "../modules/clubs/club.route";
import { EventRoutes } from "../modules/events/event.route";
import { EventRegistrationRoutes } from "../modules/Event_Registration/eventRegistration.route";
import { MembershipRoutes } from "../modules/membership/membership.route";
import { managerRoutes } from "../modules/Manager/manager.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/clubs", ClubRoutes);
router.use("/events", EventRoutes);
router.use("/eventRegistration", EventRegistrationRoutes);
router.use("/membership", MembershipRoutes);
router.use("/dashboard",DashboardRoutes);
router.use("/manager", managerRoutes);

export default router;
