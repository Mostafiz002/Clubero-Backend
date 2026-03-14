import { Club } from "../clubs/club.model";
import { Membership } from "../membership/membership.model";
import { Event } from "../events/event.model";
import { EventRegistration } from "../Event_Registration/eventRegistration.model";

export const ManagerService = {
  async getClubs(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" }).sort({ createdAt: -1 });
    return clubs;
  },

  async getClubMembers(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" });
    if (!clubs.length) return [];

    const clubIds = clubs.map((c) => c._id.toString());
    const memberships = await Membership.find({ clubId: { $in: clubIds } });

    const result = clubs.map((club) => {
      const members = memberships.filter((m) => m.clubId === club._id.toString());
      return { ...club.toObject(), members };
    });

    return result;
  },

  async getEvents(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" });
    if (!clubs.length) return [];

    const clubIds = clubs.map((c) => c._id.toString());
    const events = await Event.find({ clubId: { $in: clubIds } });
    return events;
  },

  async getEventMembers(email: string) {
    const clubs = await Club.find({ managerEmail: email, status: "approved" });
    if (!clubs.length) return [];

    const clubIds = clubs.map((c) => c._id.toString());
    const events = await Event.find({ clubId: { $in: clubIds } });
    if (!events.length) return [];

    const eventIds = events.map((e) => e._id.toString());
    const registrations = await EventRegistration.find({ eventId: { $in: eventIds } });

    const result = events.map((event) => {
      const members = registrations.filter((r) => r.eventId === event._id.toString());
      return { ...event.toObject(), members };
    });

    return result;
  },
};