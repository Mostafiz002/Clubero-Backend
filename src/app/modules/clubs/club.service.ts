import { Club } from "./club.model";

const getClubs = async (search?: string, sort?: string) => {
  const query: any = { status: "approved" };
  let sortOption: any = {};

  if (search) {
    query.clubName = { $regex: search, $options: "i" };
  }

  if (sort === "newest") sortOption = { createdAt: -1 };
  else if (sort === "oldest") sortOption = { createdAt: 1 };
  else if (sort === "fee_low") sortOption = { membershipFee: 1 };
  else if (sort === "fee_high") sortOption = { membershipFee: -1 };

  return Club.find(query).sort(sortOption);
};

const getClubById = async (id: string) => {
  return Club.findById(id);
};

const createClub = async (payload: any) => {
  payload.status = "pending";
  payload.createdAt = new Date();
  return Club.create(payload);
};

const updateClub = async (id: string, payload: any) => {
  payload.updatedAt = new Date();
  return Club.findByIdAndUpdate(id, payload, { new: true });
};

export const ClubService = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
};