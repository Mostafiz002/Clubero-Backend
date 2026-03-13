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

export const UserService = {
  createUser,
  getUserByEmail,
  getUserRole,
};