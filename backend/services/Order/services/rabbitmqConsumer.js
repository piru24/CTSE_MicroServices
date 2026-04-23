const amqp = require("amqplib");

async function startUserCreatedConsumer() {

  try {

    const connection = await amqp.connect("amqp://rabbitmq:5672");

    const channel = await connection.createChannel();

    await channel.assertExchange("user.events", "topic", {
      durable: true
    });

    const q = await channel.assertQueue("order_user_created", {
      durable: true
    });

    // Bind events
    await channel.bindQueue(q.queue, "user.events", "user.created");
    await channel.bindQueue(q.queue, "user.events", "seller.availability.changed");

    console.log("📦 Order Service listening for events...");

    channel.consume(q.queue, (msg) => {

      const routingKey = msg.fields.routingKey;
      const data = JSON.parse(msg.content.toString());

      // Handle different events
      if (routingKey === "user.created") {

        console.log("👤 New user registered:", data);

        // Example: create default cart / order profile

      } else if (routingKey === "seller.availability.changed") {

        console.log("🟢 Seller availability updated:", data);

        // Example: enable/disable ordering

      }

      channel.ack(msg);

    });

  } catch (err) {

    console.error("RabbitMQ consumer error:", err);

  }

}

module.exports = { startUserCreatedConsumer };