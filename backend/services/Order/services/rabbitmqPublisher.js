const { initRabbitMQ, getRabbitMQChannel } = require("./rabbitmqClient");

const EXCHANGE_NAME = "order.events";

async function initOrderEventPublisher() {
  const existingChannel = getRabbitMQChannel();
  if (existingChannel) {
    return existingChannel;
  }

  try {
    const { channel } = await initRabbitMQ("order-publisher", 2, 2000);

    if (!channel) {
      return null;
    }

    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: true
    });

    console.log("Order publisher exchange ready");
    return channel;
  } catch (error) {
    console.warn("Order publisher initialization skipped:", error.message);
    return null;
  }
}

async function publishOrderEvent(routingKey, payload) {
  try {
    let channel = getRabbitMQChannel();
    if (!channel) {
      channel = await initOrderEventPublisher();
    }

    if (!channel) {
      console.warn(`Skipping event ${routingKey}: RabbitMQ unavailable`);
      return;
    }

    channel.publish(
      EXCHANGE_NAME,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );
  } catch (error) {
    // Do not fail API responses if event publication fails.
    console.error("Failed to publish order event:", error.message);
  }
}

module.exports = {
  initOrderEventPublisher,
  publishOrderEvent
};
