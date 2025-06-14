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
    // Defines that change streams should trigger on insert and update operations
    const pipeline = [
      {
        $match: {
          $or: [
            { operationType: "insert" },

            {
              operationType: "update",
            },
          ],
        },
      },
    ];

    // So it returns the full document on update
    const options = {
      fullDocument: "updateLookup",
    };

    const changeStream = LineStatus.watch(pipeline, options);

    // Defines the logic for what to do when a change is detected
    changeStream.on("change", (change) => {
      console.log("Change detected matching criteria:", change.operationType);
      console.log("Full document included:", !!change.fullDocument);

      if (change.operationType === "update") {
        console.log(
          "Updated fields:",
          Object.keys(change.updateDescription.updatedFields)
        );
      }

      if (
        !change.fullDocument &&
        change.documentKey &&
        change.documentKey._id
      ) {
        console.log("fullDocument missing, fetching document by ID");

        // Just in case the full document is not returned it is fetched from the DB
        LineStatus.findById(change.documentKey._id)
          .then((doc) => {
            if (doc) {
              const modifiedChange = {
                ...change,
                fullDocument: doc,
              };
              callback(modifiedChange);
            } else {
              console.error(
                "Document not found for ID:",
                change.documentKey._id
              );
              callback(change);
            }
          })
          .catch((err) => {
            console.error("Error fetching full document:", err);
            callback(change);
          });
      } else {
        // Use the callback function with the change passed in, in this case it will be the socket function
        callback(change);
      }
    });

    changeStream.on("error", (error) => {
      console.error("Change stream error:", error);
    });

    return changeStream;
  } catch (error) {
    console.error("Failed to set up change stream:", error);
    return setupPolling(callback);
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
