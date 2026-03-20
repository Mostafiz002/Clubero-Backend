import "dotenv/config";
import { Server } from "http";
import app from "./app";
import http from "http";
import { connectDB } from "./app/config/db";

async function startServer() {
  const port = process.env.PORT || 3000;

  try {
    await connectDB();
    let server: Server;

    server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log(`Server closed gracefully.`);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    process.on("SIGTERM", exitHandler);
    process.on("SIGINT", exitHandler);

    process.on("unhandledRejection", (error) => {
      console.log("Unhandled Rejection detected, closing server...");

      if (server) {
        server.close(() => {
          console.log(error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    console.log("Server failed to start", error);
    process.exit(1);
  }
}

startServer();
