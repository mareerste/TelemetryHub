const mqtt = require("mqtt");
const TelemetryData = require("../models/telemetryData");

const mqttClient = mqtt.connect(process.env.MQTT_CONNECTION_URL);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT Broker");
  mqttClient.subscribe(process.env.MQTT_TOPIC);
});

mqttClient.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(
      `Received message on topic '${topic}': ${JSON.stringify(data)}`
    );
    saveTelemetryData(data);
  } catch (err) {
    console.error("Error parsing MQTT message:", err);
  }
});

mqttClient.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

const saveTelemetryData = async (data) => {
  try {
    const telemetryData = new TelemetryData(data);
    await telemetryData.save();
    console.log("Telemetry data saved:", telemetryData);
  } catch (err) {
    console.error("Error saving telemetry data:", err);
  }
};

const publishCommand = async (command) => {
  return new Promise((resolve, reject) => {
    const commandMessage = JSON.stringify(command);
    mqttClient.publish(process.env.MQTT_COMMAND_TOPIC, commandMessage, (err) => {
      if (err) {
        console.error("Error publishing MQTT command:", err);
        return reject(err);
      }
      console.log(`Published command: ${commandMessage} to topic ${process.env.MQTT_COMMAND_TOPIC}`);
      resolve();
    });
  });
};

module.exports = { mqttClient, publishCommand };
