const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
try{
  const connection = await amqp.connect("amqp://host.docker.internal:5672")

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