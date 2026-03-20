import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import verifyAdmin from "../../middleware/verifyAdmin";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = Router();
router.use(verifyFirebaseToken);

// MEMBER DASHBOARD
router.get("/overview", DashboardController.memberOverview);
router.get("/upcoming-events", DashboardController.upcomingEvents);
router.get("/myClubs", DashboardController.myClubs);
router.get("/myEvents", DashboardController.myEvents);

// MANAGER DASHBOARD
router.get("/overview/manager", DashboardController.managerOverview);
router.get("/manager/clubs", DashboardController.managerClubs);
router.get("/manager/clubMembers", DashboardController.clubMembers);
router.get("/manager/events", DashboardController.managerEvents);
router.get(
  "/manager/events/members",
  DashboardController.eventRegisteredMembers,
);

// UPDATE CLUB MEMBER STATUS
router.patch("/club-member/status/:id", DashboardController.updateMemberStatus);

// ADMIN DASHBOARD
router.get("/stats", verifyAdmin, DashboardController.adminStats);

export const DashboardRoutes = router;
