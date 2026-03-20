import { Router } from "express";
import { PaymentController } from "./payment.controller";
import verifyFirebaseToken from "../../middleware/verifyFirebaseToken";

const router = Router();

// CREATE STRIPE SESSION
router.post("/payment-checkout-session", PaymentController.createCheckoutSession);

// SUCCESS HANDLER
router.patch("/payment-success", PaymentController.paymentSuccess);

// CHECK PAYMENT
router.get(
  "/payments/email/club",
  verifyFirebaseToken,
  PaymentController.getPaymentByEmailAndClub
);

// USER PAYMENTS
router.get(
  "/payments",
  verifyFirebaseToken,
  PaymentController.getUserPayments
);

export const PaymentRoutes = router;