const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

//middleware
app.use(express.json());
app.use(cors());

//port and clients
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Clubero server is running!");
});

app.listen(port, () => {
  console.log(`Clubero app listening on port ${port}`);
});
