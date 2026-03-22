import { Router } from "express";
import { PaymentController } from "./payment.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import {
  createCheckoutSessionValidation,
  paymentSuccessValidation,
} from "./payment.validation";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/payment-checkout-session",
  validateRequest(createCheckoutSessionValidation),
  PaymentController.createCheckoutSession,
);
router.patch(
  "/payment-success",
  // validateRequest(paymentSuccessValidation),
  PaymentController.paymentSuccess,
);
router.get(
  "/payments/email/club",
  verifyFirebaseToken,
  PaymentController.getPaymentByEmailAndClub,
);
router.get("/payments", verifyFirebaseToken, PaymentController.getUserPayments);


// Request for Manager
router.patch(
  "/become-club-manager",
  verifyFirebaseToken,
  PaymentController.becomeClubManager,
);

export const PaymentRoutes = router;
