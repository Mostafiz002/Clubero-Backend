import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/appErrors";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  console.log("hit checkout");

  const data = await PaymentService.createCheckoutSession(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Checkout session created successfully",
    data,
  });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { session_id } = req.query as { session_id: string };

  if (!session_id) {
    throw new AppError(400, "Missing session_id");
  }

  const data = await PaymentService.handlePaymentSuccess(session_id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment processed successfully",
    data,
  });
});

const getPaymentByEmailAndClub = catchAsync(
  async (req: Request, res: Response) => {
    const { email, clubId } = req.query as {
      email: string;
      clubId: string;
    };

    if (!email || !clubId) {
      throw new AppError(400, "Email and clubId are required");
    }

    const data = await PaymentService.getPaymentByEmailAndClub(
      email,
      clubId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment retrieved successfully",
      data: data || null,
    });
  }
);

const getUserPayments = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.query as { email: string };

  if (!email) {
    throw new AppError(400, "Email is required");
  }

  if (req.token_email !== email) {
    throw new AppError(401, "Unauthorized access");
  }

  const data = await PaymentService.getUserPayments(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User payments retrieved successfully",
    data,
  });
});

const becomeClubManager = catchAsync(async (req: Request, res: Response) => {
  const email = req.token_email;

  if (!email) {
    throw new AppError(401, "Unauthorized");
  }

  const result = await PaymentService.becomeClubManager(email);

  if (!result.success) {
    throw new AppError(400, result.message || "Failed to become club manager");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Successfully became club manager",
    data: result,
  });
});

export const PaymentController = {
  createCheckoutSession,
  paymentSuccess,
  getPaymentByEmailAndClub,
  getUserPayments,
  becomeClubManager,
};