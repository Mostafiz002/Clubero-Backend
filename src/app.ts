import express, { Application, Request, Response } from "express";
import cors from "cors";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";

const app = express();

app.use(express.json());
app.use(cors());

// main route
app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.send({
    message: "Server Is Running..",
    environment: process.env.NODE_ENV,
    uptime: process.uptime().toFixed(2) + " second",
    timeStamp: new Date().toISOString(),
  });
});

app.use(notFound);

export default app;
