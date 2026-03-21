const { initRabbitMQ } = require("./rabbitmqClient");
const Product = require("../model/products");

async function startSellerAvailabilityConsumer() {

  try {
    const { channel } = await initRabbitMQ("products", 2, 2000);

    if (!channel) {
      return;
    }

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
      if (!msg) {
        return;
      }

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