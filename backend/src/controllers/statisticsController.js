const telemetryService = require("../services/telemetryService");

exports.speedPercentage = async (req, res) => {
  const { speed } = req.query;

  if (!speed || isNaN(parseFloat(speed)) || parseFloat(speed) < 0) {
    return res
      .status(400)
      .json({ error: "Invalid or missing speed threshold." });
  }

  try {
    const results = await telemetryService.getSpeedPercentage(
      parseFloat(speed)
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Error calculating speed percentage:", err);
    res.status(500).json({ error: "Failed to calculate speed percentage." });
  }
};

exports.leanAngleRange = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to || isNaN(parseFloat(from)) || isNaN(parseFloat(to))) {
    return res
      .status(400)
      .json({ error: "Invalid or missing lean angle range." });
  }

  try {
    const results = await telemetryService.getLeanAngleRange(
      parseFloat(from),
      parseFloat(to)
    );
    res.status(200).json(results);
  } catch (err) {
    console.error("Error calculating lean angle range:", err);
    res
      .status(500)
      .json({ error: "Failed to calculate lean angle range percentage." });
  }
};

exports.aggressiveDrivers = async (req, res) => {
  try {
    const results = await telemetryService.getAggressiveDrivers();
    res.status(200).json(results);
  } catch (err) {
    console.error("Error retrieving aggressive drivers:", err);
    res.status(500).json({ error: "Failed to retrieve aggressive drivers." });
  }
};
