import { Router } from "express";
import { PaymentController } from "./payment.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";
import {
  becomeClubManagerValidation,
  createCheckoutSessionValidation,
  paymentSuccessValidation,
} from "./payment.validation";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

// CREATE STRIPE SESSION
router.post(
  "/payment-checkout-session",
  validateRequest(createCheckoutSessionValidation),
  PaymentController.createCheckoutSession,
);

// SUCCESS HANDLER
router.patch(
  "/payment-success",
  validateRequest(paymentSuccessValidation),
  PaymentController.paymentSuccess,
);

// CHECK PAYMENT
router.get(
  "/payments/email/club",
  verifyFirebaseToken,
  PaymentController.getPaymentByEmailAndClub,
);

// USER PAYMENTS
router.get("/payments", verifyFirebaseToken, PaymentController.getUserPayments);

router.patch(
  "/become-club-manager",
  verifyFirebaseToken,
  validateRequest(becomeClubManagerValidation),
  PaymentController.becomeClubManager,
);

export const PaymentRoutes = router;
