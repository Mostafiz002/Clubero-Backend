import { Router } from "express";
import { ManagerController } from "./manager.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = Router();

// All manager APIs need token verification
router.use(verifyFirebaseToken);

// Get all clubs of a manager
router.get("/clubs", ManagerController.getClubs);

// Get all clubs with members
router.get("/clubMembers", ManagerController.getClubMembers);

// Get all events of manager's clubs
router.get("/events", ManagerController.getEvents);

// Get events with registered members
router.get("/events/members", ManagerController.getEventMembers);

export const managerRoutes = router;
