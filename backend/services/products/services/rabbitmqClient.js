const amqp = require("amqplib");

async function initRabbitMQ(serviceName = "products", retries = 1, retryDelayMs = 2000) {
  const rabbitUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const connection = await amqp.connect(rabbitUrl);
      const channel = await connection.createChannel();

      connection.on("error", (err) => {
        console.error(`[${serviceName}] RabbitMQ connection error:`, err.message);
      });

      connection.on("close", () => {
        console.warn(`[${serviceName}] RabbitMQ connection closed`);
      });

      console.log(`[${serviceName}] RabbitMQ connected`);
      return { connection, channel };
    } catch (error) {
      console.warn(
        `[${serviceName}] RabbitMQ unavailable (attempt ${attempt}/${retries}): ${error.message}`
      );

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  return { connection: null, channel: null };
}

module.exports = {
  initRabbitMQ
};
