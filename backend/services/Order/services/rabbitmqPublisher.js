const amqp = require("amqplib");

let channel;
let isConnected = false;
const EXCHANGE_NAME = "order.exchange";
const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function connectRabbitMQ() {
  try {
    if (!RABBITMQ_URL) {
      console.warn("RabbitMQ URL missing. Publisher disabled.");
      return;
    }

    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: true,
    });

    connection.on("close", () => {
      isConnected = false;
      channel = undefined;
      console.warn("RabbitMQ connection closed");
    });

    connection.on("error", (err) => {
      isConnected = false;
      console.error("RabbitMQ connection error:", err.message);
    });

    isConnected = true;

    console.log("RabbitMQ connected (Order Service)");
  } catch (err) {
    isConnected = false;
    console.error("RabbitMQ connection failed:", err.message);
  }
}

async function publish(routingKey, payload) {
  try {
    if (!channel) {
      console.warn(`RabbitMQ channel unavailable. Skipping publish for ${routingKey}`);
      return false;
    }

    return channel.publish(
      EXCHANGE_NAME,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
        contentType: "application/json",
      }
    );
  } catch (err) {
    console.error("RabbitMQ publish failed:", err.message);
    return false;
  }
}

async function publishOrderCreated(payload) {
  return publish("order.created", payload);
}

async function publishOrderStatusUpdated(payload) {
  return publish("order.status.updated", payload);
}

async function publishOrderDispatched(order) {
  return publish("order.dispatched", order);
}

module.exports = {
  connectRabbitMQ,
  publishOrderCreated,
  publishOrderStatusUpdated,
  publishOrderDispatched,
  isRabbitMQConnected: () => isConnected,
};