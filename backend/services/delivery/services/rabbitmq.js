const amqp = require("amqplib");
const Delivery = require("../model/delivery");

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
      setTimeout(() => startDeliveryConsumer(), 5000);
    });

    console.log("✅ Delivery Service connected to RabbitMQ");

    return connection;

  } catch (err) {
    console.log(`❌ RabbitMQ not ready, retrying... (${retries})`);

    if (retries === 0) {
      console.error("❌ Delivery Service failed to connect to RabbitMQ");
      return null;
    }

    await new Promise((res) => setTimeout(res, 5000));
    return connectRabbitMQ(retries - 1);
  }
}

async function startDeliveryConsumer() {
  const connection = await connectRabbitMQ();
  if (!connection) return;

  const channel = await connection.createChannel();

  await channel.assertExchange("order.events", "topic", {
    durable: true,
  });

  const q = await channel.assertQueue("delivery_order_dispatched", {
    durable: true,
  });

  await channel.bindQueue(
    q.queue,
    "order.events",
    "order.dispatched"
  );

  console.log("🚚 Delivery Service listening for dispatched orders...");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    console.log("📦 Received dispatched order:", data._id);

    try {
      const delivery = new Delivery({
        orderId: data._id,
        status: "pending",
      });

      await delivery.save();

      console.log("🚚 Delivery created for order:", data._id);

    } catch (err) {
      console.log("⚠️ Delivery exists or error:", err.message);
    }

    channel.ack(msg);
  });
}

module.exports = { startDeliveryConsumer };