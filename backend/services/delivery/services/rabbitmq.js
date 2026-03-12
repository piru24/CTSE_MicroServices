const amqp = require("amqplib");

async function startDeliveryConsumer() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

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