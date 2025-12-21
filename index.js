const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const admin = require("firebase-admin");

const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf8"
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//middleware
app.use(express.json());
app.use(cors());

//token verify
const verifyFirebaseToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  try {
    const userInfo = await admin.auth().verifyIdToken(token);
    req.token_email = userInfo.email;
    next();
  } catch {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

//port and clients
const port = process.env.PORT || 3000;
const uri = process.env.URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    //DB and collection
    const db = client.db("clubero_db");
    const clubsCollection = db.collection("clubs");
    const eventsCollection = db.collection("events");
    const usersCollection = db.collection("users");
    const paymentsCollection = db.collection("payments");
    const membershipCollection = db.collection("membership");
    const eventRegistrationCollection = db.collection("eventRegistration");

    //middleware with database access
    //admin verify middleware
    const verifyAdmin = async (req, res, next) => {
      const email = req.token_email;
      const user = await usersCollection.findOne({ email });

      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }

      next();
    };

    ///apis here:)

    //users api
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;

        //check if user already exists
        const email = user.email;
        const userExists = await usersCollection.findOne({ email });
        if (userExists) {
          return res.send({ message: "User already exists" });
        }

        user.role = "member";
        user.createdAt = new Date();

        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to add user" });
      }
    });

    app.get("/users", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.query.email;

        if (!email) {
          return res.send({ message: "Failed to get user" });
        }

        const query = {};
        query.email = email;
        const result = await usersCollection.findOne(query);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to get user" });
      }
    });

    app.get("/users/role/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.send({ role: user?.role || "member" });
      } catch {
        res.status(500).send({ message: "Failed to get user role" });
      }
    });

    //clubs api
    app.get("/clubs", async (req, res) => {
      try {
        const { search, sort } = req.query;
        const query = {
          status: "approved",
        };
        let sortOption = {};

        // search by club name
        if (search) {
          query.clubName = { $regex: search, $options: "i" };
        }

        // sorting logic
        if (sort === "newest") {
          sortOption = { createdAt: -1 };
        } else if (sort === "oldest") {
          sortOption = { createdAt: 1 };
        } else if (sort === "fee_low") {
          sortOption = { membershipFee: 1 };
        } else if (sort === "fee_high") {
          sortOption = { membershipFee: -1 };
        }

        const result = await clubsCollection
          .find(query)
          .sort(sortOption)
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to get clubs" });
      }
    });

    app.get("/latest-clubs", async (req, res) => {
      try {
        const result = await clubsCollection
          .find({ status: "approved" })
          .limit(8)
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to get latest clubs" });
      }
    });

    app.get("/clubs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await clubsCollection.findOne(query);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to get club data" });
      }
    });

    app.post("/clubs", verifyFirebaseToken, async (req, res) => {
      try {
        const club = req.body;
        club.status = "pending";
        club.createdAt = new Date();
        const result = await clubsCollection.insertOne(club);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to add club" });
      }
    });

    app.patch("/clubs/:id", verifyFirebaseToken, async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        updatedData.updatedAt = new Date();

        const query = { _id: new ObjectId(id) };

        const updateDoc = {
          $set: updatedData,
        };

        const result = await clubsCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update club" });
      }
    });

    //events api

    app.get("/events", async (req, res) => {
      try {
        const { limit = 0, search } = req.query;
        const query = {};

        if (search) {
          query.title = { $regex: search, $options: "i" };
        }

        const result = await eventsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .limit(Number(limit))
          .toArray();
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to get events" });
      }
    });

    app.get("/events/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await eventsCollection.findOne(query);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to get event data" });
      }
    });

    app.post("/events", verifyFirebaseToken, async (req, res) => {
      try {
        const event = req.body;
        event.createdAt = new Date();

        const result = await eventsCollection.insertOne(event);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to add event" });
      }
    });

    app.patch("/events/:id", verifyFirebaseToken, async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        const query = { _id: new ObjectId(id) };

        const updateDoc = {
          $set: updatedData,
        };

        const result = await eventsCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update event" });
      }
    });

    app.delete("/events/:id", verifyFirebaseToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await eventsCollection.deleteOne(query);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to delete event" });
      }
    });

    //event registration apis
    app.get("/eventRegistration/:id", async (req, res) => {
      try {
        const eventId = req.params.id;
        const { email } = req.query;

        if (!eventId || !email) {
          return res.status(400).send({ message: "Invalid request" });
        }

        const query = {
          email,
          eventId,
        };

        const result = await eventRegistrationCollection.findOne(query);

        res.send(result || null);
      } catch {
        res.status(500).send({ message: "Failed to get eventRegistration" });
      }
    });

    app.post("/eventRegistration", verifyFirebaseToken, async (req, res) => {
      try {
        const event = req.body;
        event.status = "registered";
        event.registeredAt = new Date();

        const result = await eventRegistrationCollection.insertOne(event);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to add event registration" });
      }
    });

    //membership api
    app.post("/membership", verifyFirebaseToken, async (req, res) => {
      try {
        const membership = req.body;

        //save in membership
        const newMembership = {
          ...membership,
          membershipFee: 0,
          joinedAt: new Date(),
          status: "active",
        };
        const membershipResult = await membershipCollection.insertOne(
          newMembership
        );

        //save payments
        const newPayments = {
          amount: 0,
          customerEmail: membership.email,
          clubId: membership.clubId,
          clubName: membership.clubName,
          transactionId: "none",
          paymentStatus: "paid",
          paidAt: new Date(),
        };
        const paymentResult = await paymentsCollection.insertOne(newPayments);

        res.send({ membership: membershipResult, payment: paymentResult });
      } catch {
        res.status(500).send({ message: "Failed to add free membership" });
      }
    });

    app.get("/membership/club", verifyFirebaseToken, async (req, res) => {
      try {
        const { clubId, email } = req.query;

        if (!clubId || !email) {
          return res.status(400).send({ message: "Invalid request" });
        }
        const query = {
          clubId,
          email,
        };

        const result = await membershipCollection.findOne(query);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to get membership data" });
      }
    });

    //dashboard overview api (member)
    app.get("/dashboard/overview", verifyFirebaseToken, async (req, res) => {
      try {
        const email = req.token_email;

        // total joined clubs
        const totalClubs = await membershipCollection.countDocuments({
          email,
          status: "active",
        });

        // total registered events
        const totalEvents = await eventRegistrationCollection.countDocuments({
          email,
        });
        res.send({
          totalClubs,
          totalEvents,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to load dashboard overview" });
      }
    });

    app.get(
      "/dashboard/upcoming-events",
      verifyFirebaseToken,
      async (req, res) => {
        try {
          const { email } = req.query;
          if (!email) {
            return res.status(400).send({ message: "Email is required" });
          }

          const now = new Date();

          //Find active memberships
          const memberships = await membershipCollection
            .find({ email, status: "active" })
            .toArray();

          // Get clubIds
          const clubIds = memberships.map((m) => m.clubId);

          if (clubIds.length === 0) {
            return res.send([]);
          }

          // Find events of those clubs
          const events = await eventsCollection
            .find({ clubId: { $in: clubIds } })
            .limit(4)
            .toArray();

          // Filter upcoming events
          const upcomingEvents = events.filter((event) => {
            return new Date(event.eventDate) > now;
          });

          // Sort by nearest date
          upcomingEvents.sort(
            (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
          );

          res.send(upcomingEvents);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Failed to get upcoming events" });
        }
      }
    );

    //dashboard my clubs api (member)
    app.get("/dashboard/myClubs", verifyFirebaseToken, async (req, res) => {
      try {
        const { email } = req.query;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        //Find active memberships
        const memberships = await membershipCollection
          .find({ email, status: "active" })
          .toArray();

        // Get clubIds
        const clubObjectIds = memberships.map((m) => new ObjectId(m.clubId));

        // Find clubs of those clubs
        const clubs = await clubsCollection
          .find({ _id: { $in: clubObjectIds } })
          .toArray();
        res.send(clubs);
      } catch {
        res.status(500).send({ message: "Failed to load clubs" });
      }
    });

    //dashboard my events api (member)
    app.get("/dashboard/myEvents", verifyFirebaseToken, async (req, res) => {
      try {
        const { email } = req.query;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        //Find active registrations
        const memberships = await eventRegistrationCollection
          .find({ email, status: "registered" })
          .toArray();

        // Get eventId
        const eventObjectIds = memberships.map((m) => new ObjectId(m.eventId));

        // Find events of those clubs
        const events = await eventsCollection
          .find({ _id: { $in: eventObjectIds } })
          .toArray();
        res.send(events);
      } catch {
        res.status(500).send({ message: "Failed to load events" });
      }
    });

    //(club manager) dashboard overview
    app.get(
      "/dashboard/overview/manager",
      verifyFirebaseToken,
      async (req, res) => {
        try {
          const email = req.token_email;

          // Get all clubs managed by this manager
          const clubs = await clubsCollection
            .find({ managerEmail: email })
            .toArray();

          const totalClubs = clubs.length;

          // Extract club ObjectIds
          const clubIds = clubs.map((club) => club._id.toString());

          // Total members (active)
          const totalMembers = await membershipCollection.countDocuments({
            clubId: { $in: clubIds },
            status: "active",
          });

          // Total events
          const totalEvents = await eventsCollection.countDocuments({
            clubId: { $in: clubIds },
          });

          // Total revenue
          const paidPayments = await paymentsCollection
            .find({
              clubId: { $in: clubIds },
              paymentStatus: "paid",
            })
            .toArray();

          const totalRevenue = paidPayments.reduce(
            (sum, payment) => sum + (payment.amount || 0),
            0
          );

          res.send({
            totalClubs,
            totalMembers,
            totalEvents,
            totalRevenue,
          });
        } catch (error) {
          console.error(error);
          res.status(500).send({
            message: "Failed to load manager overview data",
          });
        }
      }
    );

    //club manager dashboard clubs
    app.get("/manager/clubs", verifyFirebaseToken, async (req, res) => {
      try {
        const { email } = req.query;

        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        const query = {};

        query.managerEmail = email;
        query.status = "approved";

        const result = await clubsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to load clubs" });
      }
    });

    // (club manager) dashboard - Get Clubs WITH their Members
    app.get("/manager/clubMembers", verifyFirebaseToken, async (req, res) => {
      try {
        const { email } = req.query;

        // Get all clubs managed by this manager
        const clubs = await clubsCollection
          .find({ managerEmail: email, status: "approved" })
          .toArray();

        if (clubs.length === 0) {
          return res.send([]);
        }

        // Get all memberships for these clubs
        const clubIds = clubs.map((club) => club._id.toString());
        const memberships = await membershipCollection
          .find({
            clubId: { $in: clubIds },
          })
          .toArray();

        // COMBINE: Map clubs and attach matching memberships
        const result = clubs.map((club) => {
          const clubMembers = memberships.filter(
            (member) => member.clubId === club._id.toString()
          );
          return {
            ...club,
            members: clubMembers,
          };
        });

        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to load members" });
      }
    });

    //update club member status
    app.patch(
      "/club-member/status/:id",
      verifyFirebaseToken,
      async (req, res) => {
        try {
          const id = req.params.id;
          const { status } = req.query;
          const query = { _id: new ObjectId(id) };
          const updateDoc = {
            $set: {
              status: status,
            },
          };

          const result = await membershipCollection.updateOne(query, updateDoc);
          res.send(result);
        } catch {
          res.status(500).send({ message: "Failed to update status" });
        }
      }
    );

    //club manager dashboard events
    app.get("/manager/events", verifyFirebaseToken, async (req, res) => {
      try {
        const { email } = req.query;

        // Get all clubs managed by this manager
        const clubs = await clubsCollection
          .find({ managerEmail: email, status: "approved" })
          .toArray();

        if (clubs.length === 0) {
          return res.send([]);
        }

        // Get all events from these clubs
        const clubIds = clubs.map((club) => club._id.toString());
        const events = await eventsCollection
          .find({
            clubId: { $in: clubIds },
          })
          .toArray();

        res.send(events);
      } catch {
        res.status(500).send({ message: "Failed to load clubs" });
      }
    });

    //club manager dashboard (event registered members)
    app.get(
      "/manager/events/members",
      verifyFirebaseToken,
      async (req, res) => {
        try {
          const { email } = req.query;

          // Get clubs managed by this manager
          const clubs = await clubsCollection
            .find({ managerEmail: email, status: "approved" })
            .toArray();

          if (!clubs.length) {
            return res.send([]);
          }

          // Extract club IDs
          const clubIds = clubs.map((club) => club._id.toString());

          // Get events under these clubs
          const events = await eventsCollection
            .find({ clubId: { $in: clubIds } })
            .toArray();

          if (!events.length) {
            return res.send([]);
          }

          // Extract event IDs
          const eventIds = events.map((event) => event._id.toString());

          // Get event registrations
          const registrations = await eventRegistrationCollection
            .find({ eventId: { $in: eventIds } })
            .toArray();

          // Merge events with their registered members
          const result = events.map((event) => ({
            ...event,
            members: registrations.filter(
              (reg) => reg.eventId === event._id.toString()
            ),
          }));

          res.send(result);
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .send({ message: "Failed to load event registrations" });
        }
      }
    );

    // (admin) overview stats
    app.get(
      "/dashboard/stats",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const [totalClubs, totalEvents, totalMemberships] = await Promise.all(
            [
              clubsCollection.countDocuments({ status: "approved" }),
              eventsCollection.countDocuments(),
              clubsCollection.countDocuments(),
            ]
          );

          // Total revenue
          const payments = await paymentsCollection
            .find({
              paymentStatus: "paid",
            })
            .toArray();

          const totalPayments = payments.reduce(
            (sum, payment) => sum + (payment.amount || 0),
            0
          );

          res.send({
            totalClubs,
            totalEvents,
            totalMemberships,
            totalPayments,
            payments,
          });
        } catch {
          res.status(500).send({ message: "Failed to load dashboard stats" });
        }
      }
    );

    // (admin) get all users
    app.get(
      "/admin/users",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const searchText = req.query.searchText;
          const query = {};

          if (searchText) {
            query.$or = [
              { displayName: { $regex: searchText, $options: "i" } },
              { email: { $regex: searchText, $options: "i" } },
            ];
          }

          const result = await usersCollection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
          res.send(result);
        } catch {
          res.status(500).send({ message: "Failed to get users" });
        }
      }
    );

    app.patch(
      "/admin/role/:id",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const id = req.params.id;
          const { role } = req.query;
          const query = { _id: new ObjectId(id) };

          const updateDoc = {
            $set: {
              role: role,
            },
          };

          const result = await usersCollection.updateOne(query, updateDoc);
          res.send(result);
        } catch {
          res.status(500).send({ message: "Failed to update user role" });
        }
      }
    );

    //become club manager
    app.patch("/become-club-manager", verifyFirebaseToken, async (req, res) => {
      try {
        const { email } = req.query;
        const query = { email };
        const updateDoc = {
          $set: {
            becomeCM: "applied",
          },
        };
        const result = await usersCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch {
        res.status(500).send({
          message: "Failed to update user",
        });
      }
    });

    app.patch(
      "/admin/manageCM/:id",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const id = req.params.id;
          const { becomeCM } = req.query;
          const query = { _id: new ObjectId(id) };
          const updateDoc = {
            $set: {
              becomeCM: becomeCM,
            },
          };
          const result = await usersCollection.updateOne(query, updateDoc);
          res.send(result);
        } catch {
          res.status(500).send({
            message: "Failed to update user",
          });
        }
      }
    );

    app.get(
      "/admin/cm-applied-users",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const query = {};
          query.becomeCM = "applied";

          const result = await usersCollection
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
          res.send(result);
        } catch {
          res
            .status(500)
            .send({ message: "Failed to get club-manager applied users" });
        }
      }
    );

    // (admin) get all clubs for admin
    app.get(
      "/admin/clubs",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const clubs = await clubsCollection
            .find()
            .sort({ createdAt: -1 })
            .toArray();

          // Attach counts to each club
          const clubsWithCounts = await Promise.all(
            clubs.map(async (club) => {
              const clubId = club._id.toString();

              const [totalMembers, totalEvents] = await Promise.all([
                membershipCollection.countDocuments({ clubId }),
                eventsCollection.countDocuments({ clubId }),
              ]);

              return {
                ...club,
                totalMembers,
                totalEvents,
              };
            })
          );

          res.send(clubsWithCounts);
        } catch {
          res.status(500).send({ message: "Failed to get clubs" });
        }
      }
    );
    //admin u[date club status
    app.patch(
      "/admin/status/:id",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const id = req.params.id;
          const { status } = req.query;
          const query = { _id: new ObjectId(id) };

          const updateDoc = {
            $set: {
              status: status,
            },
          };

          const result = await clubsCollection.updateOne(query, updateDoc);
          res.send(result);
        } catch {
          res.status(500).send({ message: "Failed to update club status" });
        }
      }
    );

    //admin payments
    app.get(
      "/admin/payments",
      verifyFirebaseToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const payments = await paymentsCollection
            .find({ amount: { $gt: 0 } })
            .sort({ createdAt: -1 })
            .toArray();

          res.send(payments);
        } catch {
          res.status(500).send({
            message: "Failed to load payments",
          });
        }
      }
    );

    //==================payment (stripe) apis=============///

    app.post("/payment-checkout-session", async (req, res) => {
      const paymentInfo = req.body;

      const amount = parseInt(paymentInfo.membershipFee) * 100;

      try {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "bdt",
                unit_amount: amount,
                product_data: { name: paymentInfo.clubName },
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          metadata: {
            clubId: paymentInfo.clubId,
            clubName: paymentInfo.clubName,
            userEmail: paymentInfo.email,
          },
          customer_email: paymentInfo.email,
          success_url: `${process.env.SITE_DOMAIN}dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.SITE_DOMAIN}dashboard/payment-cancelled`,
        });

        res.send({ url: session.url });
      } catch (err) {
        res.status(500).send({ message: "Failed to create Stripe session" });
      }
    });

    app.patch("/payment-success", async (req, res) => {
      try {
        const sessionId = req.query.session_id;
        if (!sessionId)
          return res
            .status(400)
            .send({ success: false, message: "Missing session_id" });

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const transactionId = session.payment_intent;

        // Check duplicate
        const existingPayment = await paymentsCollection.findOne({
          transactionId,
        });
        if (existingPayment) {
          return res.send({
            success: false,
            message: "Payment already processed",
            transactionId,
          });
        }
        console.log(session.payment_status);
        if (session.payment_status === "paid") {
          const { clubId, clubName } = session.metadata;
          const email = session.customer_email;

          // Insert membership
          const membershipDoc = {
            clubId,
            clubName,
            email,
            transactionId,
            membershipFee: session.amount_total / 100,
            status: "active",
            joinedAt: new Date(),
          };
          const membershipResult = await membershipCollection.insertOne(
            membershipDoc
          );

          // Save payment
          const paymentDoc = {
            amount: session.amount_total / 100,
            customerEmail: email,
            clubId,
            clubName,
            transactionId,
            paymentStatus: session.payment_status,
            paidAt: new Date(),
          };
          const paymentResult = await paymentsCollection.insertOne(paymentDoc);

          return res.send({
            success: true,
            message: "Payment and membership recorded successfully",
            transactionId,
            membership: membershipResult,
            payment: paymentResult,
          });
        }

        return res.send({ success: false, message: "Payment not completed" });
      } catch (error) {
        console.error("Payment success error:", error);
        res.status(500).send({ success: false, error: error.message });
      }
    });

    app.get("/payments/email/club", verifyFirebaseToken, async (req, res) => {
      try {
        const { email, clubId } = req.query;

        if (!email || !clubId) {
          return res.status(400).send(null);
        }

        const query = {
          customerEmail: email,
          clubId: clubId,
          paymentStatus: "paid",
        };

        const payment = await paymentsCollection.findOne(query);
        res.send(payment || null);
      } catch {
        res.status(500).send(null);
      }
    });

    app.get("/payments", verifyFirebaseToken, async (req, res) => {
      try {
        const { email } = req.query;

        if (!email) {
          return res.send({ message: "Email is required" });
        }

        if (req.token_email !== email)
          return res.status(401).send({ message: "unauthorized access" });

        const query = { customerEmail: email };

        const payments = await paymentsCollection.find(query).toArray();
        res.send(payments);
      } catch {
        res.status(500).send({ message: "Failed to get payment data" });
      }
    });

    ///==================api ends here====================///
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Clubero server is running!");
});

app.listen(port, () => {
  console.log(`Clubero app listening on port ${port}`);
});
