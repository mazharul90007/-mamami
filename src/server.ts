import { Server } from "http";
import app from "./app";
import config from "./config";
import { connectWebSocketServer } from "./app/utils/webSocket";

let server: Server;

const main = async () => {
  try {
    server = app.listen(config.port || 5000, () => {
      console.log(`App is listening on port: ${config.port || 5000}`);
    });
    
    // Connect WebSocket
    connectWebSocketServer(server);
  } catch (err) {
    console.log("Error starting server:", err);
    process.exit(1);
  }
};

main();

// Graceful shutdown handling
const shutdown = () => {
  console.log("Shutting down servers...");

  if (server) {
    server.close(() => {
      console.log("Servers closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("unhandledRejection", (error) => {
  console.log(`unhandledRejection is detected, shutting down...`);
  console.error(error);
  shutdown();
});

process.on("uncaughtException", (error) => {
  console.log(`uncaughtException is detected, shutting down...`);
  console.error(error);
  shutdown();
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  shutdown();
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  shutdown();
});
