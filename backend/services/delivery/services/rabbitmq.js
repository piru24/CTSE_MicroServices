const { initRabbitMQ } = require("./rabbitmqClient");

async function startDeliveryConsumer() {

  try {
    const { channel } = await initRabbitMQ("delivery-consumer", 2, 2000);

    if (!channel) {
      return;
    }

    await channel.assertExchange("user.events", "topic", {
      durable: true
    });

    const q = await channel.assertQueue("delivery_seller_availability", {
      durable: true
    });

    await channel.bindQueue(
      q.queue,
      "user.events",
      "seller.availability.changed"
    );

    console.log("🚚 Delivery Service listening for events...");

    channel.consume(q.queue, (msg) => {
      if (!msg) {
        return;
      }

      const data = JSON.parse(msg.content.toString());

      console.log("🚚 Seller availability changed:", data);

      if (!data.isAvailable) {

        console.log("❌ Stop assigning deliveries for seller:", data.sellerId);

      } else {

        console.log("✅ Seller available again:", data.sellerId);

      }

      channel.ack(msg);

    });

  } catch (err) {

    console.error("RabbitMQ delivery consumer error:", err);

  }

}

module.exports = { startDeliveryConsumer };