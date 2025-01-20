# TelemetryHub

A backend service for communicating with an MQTT broker to process and analyze telemetry data from Pub-Sub nodes. This service is containerized using Docker Compose for easy deployment.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Database Schema Initialization](#database-schema-initialization)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Environment Setup](#environment-setup)
  - [Run the Application](#run-the-application)
- [API Documentation](#api-documentation)

---

## Overview

TelemetryHub is designed to handle and process telemetry data received through MQTT. It uses RabbitMQ, MongoDB, and a Node.js backend to manage and analyze data effectively. The setup includes pre-configured Pub-Sub nodes to simulate real-world data flow.

---

## Features

- **MQTT Communication**: Reliable message processing using RabbitMQ with MQTT plugin.
- **Data Storage**: Efficiently stores telemetry data in MongoDB.
- **Statistics API**: Provides endpoints for analyzing and retrieving insights from the data.
- **Dockerized Deployment**: Simplifies the setup with a multi-container Docker Compose environment.
- **Pub-Sub Nodes**: Simulate real-world telemetry data flow. Learn more about the Pub-Sub node [here](https://hub.docker.com/r/2csolutionhub/pubsub-node).

---

## Database Schema Initialization

The database schema is initialized automatically when the backend service starts. The application uses Mongoose, an Object Data Modeling (ODM) library for MongoDB, which defines and enforces the schema within the application code. This means there are no manual steps required to create the schema or indexes.

---

## Installation

### Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/mareerste/TelemetryHub.git
cd TelemetryHub
```

### Environment Setup

1. Create a `.env` file in the root directory and configure the environment variables. Example:

   ```env
   # MongoDB configuration
   MONGO_URI=mongodb://database:27017/telemetry

   # MQTT Broker configuration
   MQTT_BACKEND_CONNECTION_URL=mqtt://mqtt
   MQTT_TOPIC=stat-info
   MQTT_COMMAND_TOPIC=command

   # Pubsub configuration
   PUBSUB_MQTT_CONNECTION_URL=mqtt:5672
   PUBSUB_APP_PORT=5434
   PUBSUB_APP_LOG_LEVEL=debug

   # Backend configuration
   APP_PORT=3000
   ```

2. Install Docker and Docker Compose if they are not already installed on your machine.

### Run the Application

Use Docker Compose to build and start all services:

```bash
docker-compose up --build
```

This will spin up the following services:

- **Backend API**: Accessible at [http://localhost:3000](http://localhost:3000)
- **RabbitMQ Management UI**: Accessible at [http://localhost:15672](http://localhost:15672) (default username: `guest`, password: `guest`)
- **MongoDB**: Database for storing telemetry data
- **Pub-Sub Nodes**: Simulates data generation and communication

---

## API Documentation

The Swagger documentation for the API is available at:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Example Endpoints

- **List Data**: `/data`
- **Send Command**: `/command`
- **Speed Statistics**: `/stats/speed-percentage`
- **Lean Angle Statistics**: `/stats/lean-angle-range`
- **Aggressive Drivers**: `/stats/aggressive-drivers`

---
