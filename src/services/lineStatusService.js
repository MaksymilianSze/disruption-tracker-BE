const LineStatus = require("../models/LineStatus");

exports.getLineStatus = async (lineName) => {
  try {
    const lineStatus = await LineStatus.findOne({ lineName });
    return lineStatus || { lineName, disruptions: [] };
  } catch (error) {
    throw new Error(
      `Error fetching line status from database: ${error.message}`
    );
  }
};

exports.getAllLineStatuses = async () => {
  try {
    const allLineStatuses = await LineStatus.find({});
    return allLineStatuses;
  } catch (error) {
    throw new Error(
      `Error fetching all line statuses from database: ${error.message}`
    );
  }
};

exports.watchLineStatusChanges = (callback) => {
  try {
    const changeStream = LineStatus.watch();

    changeStream.on("change", (change) => {
      callback(change);
    });

    changeStream.on("error", (error) => {
      console.error("Change stream error:", error);
    });

    return changeStream;
  } catch (error) {
    setupPolling(callback);
    throw error;
  }
};

// As a fallback if change streams don't work
function setupPolling(callback) {
  const interval = setInterval(async () => {
    try {
      const lineStatuses = await LineStatus.find({});

      lineStatuses.forEach((lineStatus) => {
        callback({
          operationType: "update",
          fullDocument: lineStatus,
        });
      });
    } catch (error) {
      console.error("Polling error:", error);
    }
  }, 10000);

  return {
    close: () => clearInterval(interval),
  };
}
