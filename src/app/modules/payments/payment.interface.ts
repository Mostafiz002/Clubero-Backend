export interface IPayment {
  _id?: string;
  amount: number;
  customerEmail: string;
  clubId: string;
  clubName: string;
  transactionId: string;
  paymentStatus: string;
  paidAt?: Date;
}