import { Membership } from "./membership.model";
import { Payment } from "../payments/payment.model";

const createMembership = async (payload: any) => {
  const newMembership = {
    ...payload,
    membershipFee: 0,
    joinedAt: new Date(),
    status: "active",
  };

  const membershipResult = await Membership.create(newMembership);

  const paymentDoc = {
    amount: 0,
    customerEmail: payload.email,
    clubId: payload.clubId,
    clubName: payload.clubName,
    transactionId: "none",
    paymentStatus: "paid",
    paidAt: new Date(),
  };

  const paymentResult = await Payment.create(paymentDoc);

  return {
    membership: membershipResult,
    payment: paymentResult,
  };
};

const getMembershipByClub = async (clubId: string, email: string) => {
  return Membership.findOne({
    clubId,
    email,
  });
};

export const MembershipService = {
  createMembership,
  getMembershipByClub,
};