const mongoose = require("mongoose");

const affectedStationSchema = new mongoose.Schema({
  name: String,
});

const disruptionSchema = new mongoose.Schema({
  status: String,
  description: String,
  disruptionStart: Date,
  disruptionEnd: Date,
  isEntireRouteAffected: Boolean,
  affectedStations: [String],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const lineStatusSchema = new mongoose.Schema({
  lineName: {
    type: String,
    required: true,
    unique: true,
  },
  disruptions: [disruptionSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

lineStatusSchema.index({ updatedAt: 1 });

module.exports = mongoose.model("LineStatus", lineStatusSchema);
