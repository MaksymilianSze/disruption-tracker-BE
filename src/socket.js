const socketIO = require("socket.io");
const lineStatusService = require("./services/lineStatusService");

let io;
let changeStream;

const setupSocket = async (server) => {
  try {
    io = socketIO(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("subscribe", (lineName) => {
        console.log(`Client subscribed to ${lineName} updates`);
        socket.join(lineName);
      });

      socket.on("unsubscribe", (lineName) => {
        console.log(`Client unsubscribed from ${lineName} updates`);
        socket.leave(lineName);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    try {
      changeStream = lineStatusService.watchLineStatusChanges((change) => {
        if (
          change.operationType === "update" ||
          change.operationType === "insert"
        ) {
          const lineName = change.fullDocument?.lineName;
          if (lineName) {
            io.to(lineName).emit("lineUpdate", change.fullDocument);
          }
        }
      });
      console.log("WebSocket server started successfully with change streams");
    } catch (error) {
      console.log("WebSocket server started, but change streams not available");
    }

    return io;
  } catch (error) {
    console.error("Failed to setup WebSocket server:", error.message);
    return null;
  }
};

const cleanup = () => {
  if (changeStream && typeof changeStream.close === "function") {
    changeStream.close();
  }
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

module.exports = { setupSocket, getIO, cleanup };
