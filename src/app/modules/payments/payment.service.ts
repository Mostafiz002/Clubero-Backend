import Stripe from "stripe";
import { Payment } from "./payment.model";
import { Membership } from "../membership/membership.model";
import { User } from "../users/user.model";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

const createCheckoutSession = async (payload: any) => {
  const amount = parseInt(payload.membershipFee) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "bdt",
          unit_amount: amount,
          product_data: {
            name: payload.clubName,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      clubId: payload.clubId,
      clubName: payload.clubName,
      userEmail: payload.email,
    },
    customer_email: payload.email,
    success_url: `${process.env.SITE_DOMAIN}dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_DOMAIN}dashboard/payment-cancelled`,
  });

  return { url: session.url };
};

const handlePaymentSuccess = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const transactionId = session.payment_intent as string;

  // prevent duplicate
  const existingPayment = await Payment.findOne({ transactionId });
  if (existingPayment) {
    return {
      success: false,
      message: "Payment already processed",
      transactionId,
    };
  }

  if (session.payment_status === "paid") {
    const { clubId, clubName } = session.metadata as any;
    const email = session.customer_email as string;

    // membership
    const membership = await Membership.create({
      clubId,
      clubName,
      email,
      transactionId,
      membershipFee: (session.amount_total || 0) / 100,
      status: "active",
      joinedAt: new Date(),
    });

    // payment
    const payment = await Payment.create({
      amount: (session.amount_total || 0) / 100,
      customerEmail: email,
      clubId,
      clubName,
      transactionId,
      paymentStatus: session.payment_status,
      paidAt: new Date(),
    });

    return {
      success: true,
      transactionId,
      membership,
      payment,
    };
  }

  return { success: false, message: "Payment not completed" };
};

const getPaymentByEmailAndClub = async (email: string, clubId: string) => {
  return await Payment.findOne({
    customerEmail: email,
    clubId,
    paymentStatus: "paid",
  });
};

const getUserPayments = async (email: string) => {
  return await Payment.find({ customerEmail: email });
};

const becomeClubManager = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  // already applied
  if (user.becomeCM === "applied") {
    return {
      success: false,
      message: "Already applied",
      data: user,
    };
  }

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { becomeCM: "applied" },
    { new: true },
  );

  return {
    success: true,
    message: "Application submitted",
    data: updatedUser,
  };
};

export const PaymentService = {
  createCheckoutSession,
  handlePaymentSuccess,
  getPaymentByEmailAndClub,
  getUserPayments,
  becomeClubManager,
};