const amqp = require("amqplib");

let channel;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

async function connectRabbitMQ() {
try{
  const connection = await amqp.connect(RABBITMQ_URL)

  channel = await connection.createChannel();

  await channel.assertExchange("order.events", "topic", {
    durable: true
  });

 console.log("📡 RabbitMQ connected (Order Service)");
  } catch (err) {
    console.error("❌ RabbitMQ connection failed:", err);
  }

}

async function publishOrderDispatched(order) {

  const routingKey = "order.dispatched";

  channel.publish(
    "order.events",
    routingKey,
    Buffer.from(JSON.stringify(order))
  );

  console.log("📦 Order dispatched event sent:", order._id);

}

module.exports = { connectRabbitMQ, publishOrderDispatched };