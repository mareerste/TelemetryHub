const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
  brand: String,
  model: String,
  speed: Number,
  rpm: Number,
  throttle_position: Number,
  brake_pressure: Number,
  lean_angle: Number,
  timestamp: { type: Date, default: Date.now },
});

// Indexes
telemetrySchema.index({ brand: 1, model: 1 });
telemetrySchema.index({ speed: -1, throttle_position: -1, brake_pressure: -1 });
telemetrySchema.index({ lean_angle: 1 });
telemetrySchema.index({ timestamp: 1 });

module.exports = mongoose.model("TelemetryData", telemetrySchema);
