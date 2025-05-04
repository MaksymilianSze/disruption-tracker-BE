const mongoose = require("mongoose");

const disruptionSchema = new mongoose.Schema({
  status: String,
  description: String,
  disruptionStart: Date,
  disruptionEnd: Date,
  isEntireRouteAffected: Boolean,
  affectedStations: [String],
  originatingStation: String || null,
  terminatingStation: String || null,
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
