const express = require("express");
const dataController = require("../controllers/dataController");
const statsController = require("../controllers/statisticsController");
const router = express.Router();

router.post("/command", async (req, res) => {
  const { action } = req.body;

  if (!["pause", "resume"].includes(action)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid action provided. Please use 'pause' to stop the process or 'resume' to continue it.",
      });
  }

  const command = {
    stop: action === "pause",
  };

  dataController.sendCommand(command, action, res);
});

router.get("/data", dataController.listTelemetryData);
router.get("/stats/speed-percentage", statsController.speedPercentage);
router.get("/stats/lean-angle-range", statsController.leanAngleRange);
router.get("/stats/aggressive-drivers", statsController.aggressiveDrivers);

module.exports = router;
