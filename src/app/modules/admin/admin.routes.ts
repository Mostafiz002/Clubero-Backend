import { Router } from "express";
import { AdminController } from "./admin.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import verifyAdmin from "../../middleware/verifyAdmin";

const router = Router();

router.use(verifyFirebaseToken, verifyAdmin);

// users
router.get("/users", AdminController.getUsers);
router.patch("/role/:id", AdminController.updateUserRole);

// club manager requests
router.get("/cm-applied-users", AdminController.getCMAppliedUsers);
router.patch("/manageCM/:id", AdminController.updateCMStatus);

// clubs
router.get("/clubs", AdminController.getClubs);
router.patch("/status/:id", AdminController.updateClubStatus);

// payments
router.get("/payments", AdminController.getPayments);

export const AdminRoutes = router;