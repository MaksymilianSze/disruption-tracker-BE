const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");

dotenv.config();

const apiRoutes = require("./routes/api");
const connectDB = require("./config/db");
const workerManager = require("./workers/workerManager");
const { setupSocket, cleanup } = require("./socket");

// Check if we're running in API-only mode
const isApiOnlyMode = process.env.NODE_ENV === "api-only";

const app = express();
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:4173"],
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Disruption Tracker API is running" });
});

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = http.createServer(app);

const start = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (isApiOnlyMode) {
        console.log(
          "Running in API-only mode (WebSocket and workers disabled)"
        );
      }
    });

    if (!isApiOnlyMode) {
      try {
        await setupSocket(server);
        console.log("WebSocket server started successfully");
      } catch (socketError) {
        console.log(
          "WebSocket setup failed, continuing without real-time updates"
        );
        console.error(socketError);
      }

      workerManager.startAll();
      console.log("Worker manager started successfully");
    }

    const shutdown = () => {
      console.log("Shutting down gracefully...");

      if (!isApiOnlyMode) {
        cleanup();
        workerManager.stopAll();
      }

      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

start();
