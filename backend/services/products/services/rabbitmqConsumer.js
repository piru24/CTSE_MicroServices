const amqp = require("amqplib");
const Product = require("../model/products");

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
      setTimeout(() => startSellerAvailabilityConsumer(), 5000);
    });

    console.log("✅ Product Service connected to RabbitMQ");

    return connection;

  } catch (err) {
    console.log(`❌ RabbitMQ not ready, retrying... (${retries})`);

    if (retries === 0) {
      console.error("❌ Product Service failed to connect to RabbitMQ");
      return null;
    }

    await new Promise((res) => setTimeout(res, 5000));
    return connectRabbitMQ(retries - 1);
  }
}

async function startSellerAvailabilityConsumer() {
  const connection = await connectRabbitMQ();
  if (!connection) return;

  const channel = await connection.createChannel();

  await channel.assertExchange("user.events", "topic", {
    durable: true,
  });

  const q = await channel.assertQueue("product_seller_availability", {
    durable: true,
  });

  await channel.bindQueue(
    q.queue,
    "user.events",
    "seller.availability.changed"
  );

  console.log("🛒 Product Service listening for seller availability events...");

  channel.consume(q.queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    console.log("📦 Seller availability event:", data);

    try {
      await Product.updateMany(
        { sellerId: data.sellerId },
        { sellerAvailable: data.isAvailable }
      );
    } catch (err) {
      console.error("❌ Product update failed:", err.message);
    }

    channel.ack(msg);
  });
}

module.exports = { startSellerAvailabilityConsumer };