const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {

  const connection = await amqp.connect("amqp://localhost");

  channel = await connection.createChannel();

  await channel.assertExchange("order.events", "topic", {
    durable: true
  });

  console.log("📡 RabbitMQ connected (Order Service)");

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