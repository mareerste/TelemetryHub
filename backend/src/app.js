const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
const apiRoutes = require("./routes/api");
const { mqttClient } = require("./config/mqttClient"); 


const { connectDatabase } = require("./config/database");

require("dotenv").config();

const app = express();
connectDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/api", apiRoutes);

module.exports = app;
