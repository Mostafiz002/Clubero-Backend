const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

//middleware
app.use(express.json());
app.use(cors());

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
    const usersCollection = db.collection("users");

    //apis here:)

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
