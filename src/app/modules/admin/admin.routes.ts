import { Router } from "express";
import { AdminController } from "./admin.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import verifyAdmin from "../../middleware/verifyAdmin";

const router = Router();

// router.use(verifyFirebaseToken, verifyAdmin);

// USERS
router.get("/users", AdminController.getUsers);
router.patch("/role/:id", AdminController.updateUserRole);

// CLUB MANAGER REQUESTS
router.get("/cm-applied-users", AdminController.getCMAppliedUsers);
router.patch("/manageCM/:id", AdminController.updateCMStatus);

// CLUBS
router.get("/clubs", AdminController.getClubs);
router.patch("/status/:id", AdminController.updateClubStatus);

// PAYMENTS
router.get("/payments", AdminController.getPayments);

export const AdminRoutes = router;