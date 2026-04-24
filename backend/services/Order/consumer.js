const amqp = require("amqplib");

async function startConsumer() {

  try {

    const connection = await amqp.connect("amqp://rabbitmq:5672");

    const channel = await connection.createChannel();

    // Make sure exchange exists
    await channel.assertExchange("user.events", "topic", {
      durable: true
    });

    // Create queue for order service
    const q = await channel.assertQueue("order_user_created", {
      durable: true
    });

    // Bind queue to event
    await channel.bindQueue(q.queue, "user.events", "user.created");

    console.log("📦 Order Service listening for user.created events...");

    channel.consume(q.queue, (msg) => {

      const data = JSON.parse(msg.content.toString());

      console.log("👤 New user registered:", data);

      // Later you could create default cart, order profile, etc.

      channel.ack(msg);

    });

  } catch (err) {

    console.error("RabbitMQ error:", err);

  }

}

startConsumer();