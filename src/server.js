const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const helmet = require("helmet");

dotenv.config();

const apiRoutes = require("./routes/api");
const connectDB = require("./config/db");
const workerManager = require("./workers/workerManager");
const { setupSocket, cleanup } = require("./socket");

const app = express();
app.use(helmet());
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
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
    });

    try {
      await setupSocket(server);
    } catch (socketError) {
      console.log(
        "WebSocket setup failed, continuing without real-time updates"
      );
    }

    workerManager.startAll();

    const shutdown = () => {
      console.log("Shutting down gracefully...");
      cleanup();
      workerManager.stopAll();
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
