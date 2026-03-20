import { User } from "../users/user.model";
import { Club } from "../clubs/club.model";
import { Membership } from "../membership/membership.model";
import { Event } from "../events/event.model";
import { Payment } from "../payments/payment.model";

export const AdminService = {
  async getAllUsers(searchText?: string) {
    const query: any = {};

    if (searchText) {
      query.$or = [
        { displayName: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
      ];
    }

    return await User.find(query).sort({ createdAt: -1 });
  },

  async updateUserRole(id: string, role: string) {
    return await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
  },

  async getCMAppliedUsers() {
    return await User.find({ becomeCM: "applied" }).sort({
      createdAt: -1,
    });
  },

  async updateCMStatus(id: string, becomeCM: string) {
    return await User.findByIdAndUpdate(
      id,
      { becomeCM },
      { new: true }
    );
  },

  async getAllClubs() {
    const clubs = await Club.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      clubs.map(async (club) => {
        const clubId = club._id.toString();

        const totalMembers = await Membership.countDocuments({ clubId });
        const totalEvents = await Event.countDocuments({ clubId });

        return {
          ...club.toObject(),
          totalMembers,
          totalEvents,
        };
      })
    );

    return result;
  },

  async updateClubStatus(id: string, status: string) {
    return await Club.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  },

  async getPayments() {
    return await Payment.find({ amount: { $gt: 0 } }).sort({
      createdAt: -1,
    });
  },
};