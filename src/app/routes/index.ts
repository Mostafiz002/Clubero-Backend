import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { ClubRoutes } from "../modules/clubs/club.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/clubs", ClubRoutes);

export default router;