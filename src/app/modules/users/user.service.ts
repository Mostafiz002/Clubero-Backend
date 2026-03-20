import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser) => {
  const email = payload.email;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return { message: "User already exists" };
  }

  const user = await User.create({
    ...payload,
    role: "member",
    createdAt: new Date(),
  });

  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserRole = async (email: string) => {
  const user = await User.findOne({ email });

  return {
    role: user?.role || "member",
  };
};

const becomeClubManager = async (email: string) => {
  return await User.findOneAndUpdate(
    { email },
    { becomeCM: "applied" },
    { new: true },
  );
};

export const UserService = {
  createUser,
  getUserByEmail,
  getUserRole,
  becomeClubManager,
};
