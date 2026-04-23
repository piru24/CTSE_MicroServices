const amqp = require("amqplib");
const Delivery = require("../model/delivery");

async function startDeliveryConsumer() {

  try {

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange("order.events", "topic", {
      durable: true
    });

    const q = await channel.assertQueue("delivery_order_dispatched", {
      durable: true
    });

    await channel.bindQueue(
      q.queue,
      "order.events",
      "order.dispatched"
    );

    console.log("🚚 Delivery Service listening for dispatched orders...");

    channel.consume(q.queue, async (msg) => {

      const data = JSON.parse(msg.content.toString());

      console.log("📦 Received dispatched order:", data._id);

      try {

        const delivery = new Delivery({
          orderId: data._id,
          status: "pending"
        });

        await delivery.save();

        console.log("🚚 Delivery created for order:", data._id);

      } catch (err) {

        console.log("⚠️ Delivery already exists or error:", err.message);

      }

      channel.ack(msg);

    });

  } catch (err) {

    console.error("RabbitMQ delivery consumer error:", err);

  }

}

module.exports = { startDeliveryConsumer };