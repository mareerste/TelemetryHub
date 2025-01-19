const mongoose = require('mongoose');

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

module.exports = mongoose.model('TelemetryData', telemetrySchema);
