const amqp = require("amqplib");

let channel = null;

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

// 🔁 Retry connection
async function connectRabbitMQ(retries = 10) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.warn("RabbitMQ connection closed. Reconnecting...");
      setTimeout(() => connectRabbitMQ(), 5000);
    });

    channel = await connection.createChannel();

    await channel.assertExchange("order.events", "topic", {
      durable: true,
    });

    console.log("📡 Order Service connected to RabbitMQ");

  } catch (err) {
    console.log(`❌ RabbitMQ not ready, retrying... (${retries})`);

    if (retries === 0) {
      console.error("❌ Order Service failed to connect to RabbitMQ");
      return;
    }

    await new Promise((res) => setTimeout(res, 5000));
    return connectRabbitMQ(retries - 1);
  }
}

// 🔐 Safe publish
function isChannelReady() {
  if (!channel) {
    console.log("⚠️ RabbitMQ not ready. Skipping order event.");
    return false;
  }
  return true;
}

// 📦 Publish event
function publishOrderDispatched(order) {
  if (!isChannelReady()) return;

  const routingKey = "order.dispatched";

  channel.publish(
    "order.events",
    routingKey,
    Buffer.from(JSON.stringify(order)),
    { persistent: true }
  );

  console.log("📦 Order dispatched event sent:", order._id);
}

module.exports = {
  connectRabbitMQ,
  publishOrderDispatched,
};