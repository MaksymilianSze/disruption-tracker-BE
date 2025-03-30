const socketIO = require("socket.io");
const lineStatusService = require("./services/lineStatusService");
const LineStatus = require("./models/LineStatus");

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

        lineStatusService
          .getLineStatus(lineName)
          .then((status) => {
            if (status) {
              socket.emit("lineUpdate", status);
            }
          })
          .catch((err) => console.error("Error fetching initial status:", err));
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
      console.log("Setting up filtered change stream...");
      changeStream = lineStatusService.watchLineStatusChanges(
        async (change) => {
          console.log(
            "Change received in socket handler:",
            change.operationType
          );

          if (
            change.operationType === "update" ||
            change.operationType === "insert"
          ) {
            if (change.operationType === "update") {
              const updatedFields =
                change.updateDescription?.updatedFields || {};
              const fieldKeys = Object.keys(updatedFields);

              const hasRelevantChanges = fieldKeys.some(
                (key) =>
                  key.includes("disruptions.status") ||
                  key.includes("disruptions.isEntireRouteAffected") ||
                  key.includes("disruptions.affectedStations")
              );

              if (!hasRelevantChanges) {
                console.log(
                  "Change detected but not in targeted fields, ignoring"
                );
                return;
              }
            }

            let documentToSend = change.fullDocument;

            if (
              !documentToSend &&
              change.documentKey &&
              change.documentKey._id
            ) {
              try {
                console.log(
                  "Fetching document for ID:",
                  change.documentKey._id
                );
                documentToSend = await LineStatus.findById(
                  change.documentKey._id
                );
              } catch (err) {
                console.error("Error fetching document:", err);
                return;
              }
            }

            if (documentToSend && documentToSend.lineName) {
              const lineName = documentToSend.lineName;
              console.log(`Broadcasting update for ${lineName} line`);

              const roomSize =
                io.sockets.adapter.rooms.get(lineName)?.size || 0;
              console.log(`Subscribers in ${lineName} room: ${roomSize}`);

              io.to(lineName).emit("lineUpdate", documentToSend);
            } else {
              console.log(
                "Missing document or lineName, cannot broadcast update"
              );
            }
          }
        }
      );
      console.log(
        "WebSocket server started successfully with filtered change streams"
      );
    } catch (error) {
      console.log("WebSocket server started, but change streams not available");
      console.error(error);
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
