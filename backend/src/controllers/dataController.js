const telemetryService = require("../services/telemetryService");

exports.listTelemetryData = async (req, res) => {
  try {
    const { page, limit, sort, filter } = req.query;
    const query = filter ? JSON.parse(filter) : {};

    const result = await telemetryService.getTelemetryData(query, {
      page,
      limit,
      sort,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.sendCommand = async (command, action, res) => {
    try {
        await telemetryService.sendCommand(command);
        res.status(200).send(`${action} command sent`);
      } catch (err) {
        res.status(500).json({ error: `Failed to send ${action} command` });
      }
}

