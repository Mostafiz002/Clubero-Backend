const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const admin = require("firebase-admin");

const serviceAccount = require("./clubero-firebase-sdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//middleware
app.use(express.json());
app.use(cors());

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
        const query = {};
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
          .find()
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

    app.post("/clubs", async (req, res) => {
      try {
        const club = req.body;
        club.createdAt = new Date();
        club.updatedAt = new Date();
        const result = await clubsCollection.insertOne(club);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to add club" });
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

    app.post("/events", async (req, res) => {
      try {
        const event = req.body;
        event.createdAt = new Date();

        const result = await eventsCollection.insertOne(event);
        res.send(result);
      } catch {
        res.status(500).send({ message: "Failed to add event" });
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

    //dashboard overview api
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

    app.get("/dashboard/upcoming-events", async (req, res) => {
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
    });

    //payment (stripe) apis

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

    ///api ends here///
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
