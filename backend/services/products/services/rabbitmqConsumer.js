const amqp = require("amqplib");
const Product = require("../model/products");

async function startSellerAvailabilityConsumer() {

  try {

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange("user.events", "topic", {
      durable: true
    });

    const q = await channel.assertQueue("product_seller_availability", {
      durable: true
    });

    await channel.bindQueue(
      q.queue,
      "user.events",
      "seller.availability.changed"
    );

    console.log("🛒 Product Service listening for seller availability events...");

    channel.consume(q.queue, async (msg) => {

      const data = JSON.parse(msg.content.toString());

      console.log("📦 Seller availability event:", data);

      await Product.updateMany(
        { sellerId: data.sellerId },
        { sellerAvailable: data.isAvailable }
      );

      channel.ack(msg);

    });

  } catch (err) {

    console.error("RabbitMQ product consumer error:", err);

  }

}

module.exports = { startSellerAvailabilityConsumer };