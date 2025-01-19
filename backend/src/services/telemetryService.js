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
};

const getSpeedPercentage = async (speedThreshold) => {
  return await TelemetryData.aggregate([
    { $match: { speed: { $gt: speedThreshold } } },
    {
      $group: {
        _id: { brand: "$brand", model: "$model" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: "$count" },
        groupedResults: { $push: "$$ROOT" },
      },
    },
    {
      $unwind: "$groupedResults",
    },
    {
      $addFields: {
        percentage: {
          $round: [
            {
              $multiply: [
                { $divide: ["$groupedResults.count", "$totalCount"] },
                100,
              ],
            },
            2,
          ],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          brand: "$groupedResults._id.brand",
          model: "$groupedResults._id.model",
          count: "$groupedResults.count",
          percentage: "$percentage",
        },
      },
    },
  ]);
};

const getLeanAngleRange = async (fromAngle, toAngle) => {
  return await TelemetryData.aggregate([
    { $match: { lean_angle: { $gte: fromAngle, $lte: toAngle } } },
    {
      $group: {
        _id: { brand: "$brand", model: "$model" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $group: {
        _id: null,
        totalCount: { $sum: "$count" },
        groupedResults: { $push: "$$ROOT" },
      },
    },
    { $unwind: "$groupedResults" },
    {
      $addFields: {
        percentage: {
          $round: [
            {
              $multiply: [
                { $divide: ["$groupedResults.count", "$totalCount"] },
                100,
              ],
            },
            2,
          ],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          brand: "$groupedResults._id.brand",
          model: "$groupedResults._id.model",
          count: "$groupedResults.count",
          percentage: "$percentage",
        },
      },
    },
  ]);
};

const getAggressiveDrivers = async () => {
  const results = await TelemetryData.aggregate([
    {
      $match: {
        $and: [
          { speed: { $gte: 100 } },
          { throttle_position: { $gte: 50 } },
          { brake_pressure: { $gte: 30 } },
        ],
      },
    },
    { $sort: { speed: -1, throttle_position: -1 } },
    {
      $group: {
        _id: { brand: "$brand", model: "$model" },
        avg_speed: { $avg: "$speed" },
        avg_throttle: { $avg: "$throttle_position" },
        avg_brake: { $avg: "$brake_pressure" },
        drivers: {
          $push: {
            speed: "$speed",
            rpm: "$rpm",
            throttle_position: "$throttle_position",
            brake_pressure: "$brake_pressure",
            lean_angle: "$lean_angle",
            timestamp: "$timestamp",
          },
        },
      },
    },
    {
      $project: {
        brand: "$_id.brand",
        model: "$_id.model",
        avg_speed: 1,
        avg_throttle: 1,
        avg_brake: 1,
        drivers: { $slice: ["$drivers", 10] },
      },
    },
    {
      $group: {
        _id: "$brand",
        avg_speed: { $avg: "$avg_speed" },
        avg_throttle: { $avg: "$avg_throttle" },
        avg_brake: { $avg: "$avg_brake" },
        models: {
          $push: {
            model: "$model",
            avg_speed: "$avg_speed",
            avg_throttle: "$avg_throttle",
            avg_brake: "$avg_brake",
            drivers: "$drivers",
          },
        },
      },
    },
    { $sort: { avg_speed: -1, avg_throttle: -1, avg_brake: -1 } },
  ]);

  return results.reduce((acc, item) => {
    const { _id: brand, models } = item;
    acc[brand] = models.reduce((modelsAcc, model) => {
      modelsAcc[model.model] = model.drivers;
      return modelsAcc;
    }, {});
    return acc;
  }, {});
};

module.exports = {
  getTelemetryData,
  sendCommand,
  getSpeedPercentage,
  getLeanAngleRange,
  getAggressiveDrivers,
};
