import { Club } from "./club.model";
import { cacheWrapper } from "../../utils/cacheWrapper"; 
import { invalidateCache } from "../../utils/invalidateCache";

const getClubs = async (search?: string, sort?: string) => {
  const cacheKey = `clubs:${search || "all"}:${sort || "default"}`;

  return cacheWrapper(cacheKey, async () => {
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
  }, 60); 
};

const getClubById = async (id: string) => {
  return Club.findById(id);
};

const createClub = async (payload: any) => {
  payload.status = "pending";
  payload.createdAt = new Date();
  const club = await Club.create(payload);

  await invalidateCache("clubs:*");

  return club;
};

const updateClub = async (id: string, payload: any) => {
  payload.updatedAt = new Date();
  const updatedClub = await Club.findByIdAndUpdate(id, payload, { new: true });

  await invalidateCache("clubs:*");

  return updatedClub;
};

const getLatestClubs = async () => {
  return Club.find({ status: "approved" }).sort({ createdAt: -1 }).limit(8);
};

export const ClubService = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  getLatestClubs,
};