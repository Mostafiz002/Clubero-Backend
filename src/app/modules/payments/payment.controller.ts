import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export const PaymentController = {
  createCheckoutSession: async (req: Request, res: Response) => {
    const data = await PaymentService.createCheckoutSession(req.body);
    res.send(data);
  },

  paymentSuccess: async (req: Request, res: Response) => {
    const { session_id } = req.query as { session_id: string };

    if (!session_id) {
      return res
        .status(400)
        .send({ success: false, message: "Missing session_id" });
    }

    const data = await PaymentService.handlePaymentSuccess(session_id);
    res.send(data);
  },

  getPaymentByEmailAndClub: async (req: Request, res: Response) => {
    const { email, clubId } = req.query as {
      email: string;
      clubId: string;
    };

    if (!email || !clubId) {
      return res.status(400).send(null);
    }

    const data = await PaymentService.getPaymentByEmailAndClub(email, clubId);
    res.send(data || null);
  },

  getUserPayments: async (req: Request, res: Response) => {
    const { email } = req.query as { email: string };

    if (!email) {
      return res.send({ message: "Email is required" });
    }

    if (req.token_email !== email) {
      return res.status(401).send({ message: "unauthorized access" });
    }

    const data = await PaymentService.getUserPayments(email);
    res.send(data);
  },

  becomeClubManager: async (req: Request, res: Response) => {
    const email = req.token_email;
    const data = await PaymentService.becomeClubManager(email as string);
    res.send(data);
  },
};
