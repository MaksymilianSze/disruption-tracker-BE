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
    const pipeline = [
      {
        $match: {
          $or: [
            {
              "updateDescription.updatedFields.disruptions.status": {
                $exists: true,
              },
            },
            {
              "updateDescription.updatedFields.disruptions.isEntireRouteAffected":
                { $exists: true },
            },
            {
              "updateDescription.updatedFields.disruptions.affectedStations": {
                $exists: true,
              },
            },
            { operationType: "insert" },
          ],
        },
      },
    ];

    const options = {
      fullDocument: "updateLookup",
    };

    const changeStream = LineStatus.watch(pipeline, options);

    changeStream.on("change", (change) => {
      console.log("Change detected matching criteria:", change.operationType);
      console.log("Full document included:", !!change.fullDocument);

      if (change.operationType === "update") {
        console.log(
          "Updated fields:",
          Object.keys(change.updateDescription.updatedFields).join(", ")
        );
      }

      if (
        !change.fullDocument &&
        change.documentKey &&
        change.documentKey._id
      ) {
        console.log("fullDocument missing, fetching document by ID");
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
        callback(change);
      }
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
