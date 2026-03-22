export interface IClub {
  clubName: string;

  description?: string;
  category?: string;
  location?: string;
  bannerImage?: string;

  membershipFee?: number;

  managerEmail: string;
  managerName?: string;
  managerImage?: string;

  status?: "pending" | "approved" | "rejected";

  createdAt?: Date;
  updatedAt?: Date;
}
