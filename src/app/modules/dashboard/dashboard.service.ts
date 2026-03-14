import { Membership } from "../membership/membership.model";
import { EventRegistration } from "../Event_Registration/eventRegistration.model";
import { Club } from "../clubs/club.model";
import { Event } from "../events/event.model";
import { Payment } from "../payments/payment.model";
import { User } from "../users/user.model";

export const DashboardService = {
  // MEMBER DASHBOARD
  async getMemberOverview(email: string) {
    const totalClubs = await Membership.countDocuments({ email, status: "active" });
    const totalEvents = await EventRegistration.countDocuments({ email });
    return { totalClubs, totalEvents };
  },

  async getUpcomingEvents(email: string) {
    const now = new Date();
    const memberships = await Membership.find({ email, status: "active" });
    const clubIds = memberships.map((m) => m.clubId);
    if (!clubIds.length) return [];

    const events = await Event.find({ clubId: { $in: clubIds } }).limit(4).lean();
    const upcomingEvents = events
      .filter((e) => new Date(e.eventDate) > now)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    return upcomingEvents;
  },

  async getMyClubs(email: string) {
    const memberships = await Membership.find({ email, status: "active" });
    const clubIds = memberships.map((m) => m.clubId);
    if (!clubIds.length) return [];
    const clubs = await Club.find({ _id: { $in: clubIds } });
    return clubs;
  },

  async getMyEvents(email: string) {
    const registrations = await EventRegistration.find({ email, status: "registered" });
    const eventIds = registrations.map((r) => r.eventId);
    if (!eventIds.length) return [];
    const events = await Event.find({ _id: { $in: eventIds } });
    return events;
  },

  // MANAGER DASHBOARD
  async getManagerOverview(email: string) {
    const clubs = await Club.find({ managerEmail: email });
    const clubIds = clubs.map((c) => c._id.toString());

    const totalMembers = await Membership.countDocuments({ clubId: { $in: clubIds }, status: "active" });
    const totalEvents = await Event.countDocuments({ clubId: { $in: clubIds } });
    const paidPayments = await Payment.find({ clubId: { $in: clubIds }, paymentStatus: "paid" });
    const totalRevenue = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return { totalClubs: clubs.length, totalMembers, totalEvents, totalRevenue };
  },

  async getManagerClubs(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" });
    return clubs;
  },

  async getClubMembers(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" });
    const clubIds = clubs.map((c) => c._id.toString());
    const memberships = await Membership.find({ clubId: { $in: clubIds } });

    return clubs.map((club) => ({
      ...club.toObject(),
      members: memberships.filter((m) => m.clubId === club._id.toString()),
    }));
  },

  async getManagerEvents(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" });
    const clubIds = clubs.map((c) => c._id.toString());
    const events = await Event.find({ clubId: { $in: clubIds } });
    return events;
  },

  async getEventRegisteredMembers(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" });
    const clubIds = clubs.map((c) => c._id.toString());
    const events = await Event.find({ clubId: { $in: clubIds } });
    const eventIds = events.map((e) => e._id.toString());
    const registrations = await EventRegistration.find({ eventId: { $in: eventIds } });

    return events.map((event) => ({
      ...event.toObject(),
      members: registrations.filter((r) => r.eventId === event._id.toString()),
    }));
  },

  async updateMemberStatus(memberId: string, status: string) {
    return await Membership.updateOne({ _id: memberId }, { $set: { status } });
  },

  // ADMIN DASHBOARD
  async getAdminStats() {
    const totalClubs = await Club.countDocuments({ status: "approved" });
    const totalEvents = await Event.countDocuments();
    const totalMemberships = await Membership.countDocuments();
    const totalUsers = await User.countDocuments();

    const payments = await Payment.find({ paymentStatus: "paid" });
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return { totalClubs, totalEvents, totalMemberships, totalUsers, totalPayments, payments };
  },
};