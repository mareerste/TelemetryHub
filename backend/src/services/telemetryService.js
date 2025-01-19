const TelemetryData = require("../models/telemetryData");
const { publishCommand } = require("../config/mqttClient");

const getTelemetryData = async (
  query = {},
  { page = 1, limit = 10, sort = "timestamp" } = {}
) => {
  try {
    const data = await TelemetryData.find(query)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await TelemetryData.countDocuments(query);
    return {
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    };
  } catch (err) {
    console.error("Error retrieving telemetry data:", err);
  }
};

const sendCommand = async (command) => {
  try {
    await publishCommand(command);
  } catch (err) {
    console.error("Error sending command:", err);
    throw new Error("Failed to send command");
  }
}


module.exports = { getTelemetryData, sendCommand };
