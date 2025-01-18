const express = require("express");
const amqp = require("amqplib");

const app = express();
const port = 3000;

async function connectRabbitMQ() {
  const queue = "stat-info-queue";
  const retryInterval = 5000;

  let connected = false;
  while (!connected) {
    try {
      const connection = await amqp.connect("amqp://mqtt");
      const channel = await connection.createChannel();

      await channel.checkQueue(queue);

      console.log(`Waiting for messages in queue: ${queue}`);

      channel.consume(
        queue,
        (msg) => {
          if (msg) {
            console.log(`Received message: ${msg.content.toString()}`);
          }
        },
        { noAck: true }
      );

      connected = true;
    } catch (err) {
      console.error(
        `Error connecting to RabbitMQ or queue not found, retrying in ${
          retryInterval / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
}

connectRabbitMQ();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
