const amqp = require("amqplib");

let channel = null;

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

// 🔁 Retry connection
async function connectRabbitMQ(retries = 10) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.warn("RabbitMQ connection closed. Reconnecting...");
      setTimeout(() => connectRabbitMQ(), 5000);
    });

    channel = await connection.createChannel();

    // Queue for email verification
    await channel.assertQueue("user_signup", { durable: true });

    // Exchange for microservice events
    await channel.assertExchange("user.events", "topic", {
      durable: true,
    });

    console.log("✅ RabbitMQ connected");

  } catch (error) {
    console.log(`❌ RabbitMQ not ready, retrying... (${retries})`);

    if (retries === 0) {
      console.error("❌ Failed to connect to RabbitMQ");
      return;
    }

    await new Promise((res) => setTimeout(res, 5000));
    return connectRabbitMQ(retries - 1);
  }
}

// 🔐 Safe publish helper
function isChannelReady() {
  if (!channel) {
    console.log("⚠️ RabbitMQ not ready. Skipping event.");
    return false;
  }
  return true;
}

// 📧 Email verification event
function publishUserSignup(data) {
  if (!isChannelReady()) return;

  channel.sendToQueue(
    "user_signup",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log("📨 Signup event sent to Email Service");
}

// 📡 User created event
function publishUserCreated(user) {
  if (!isChannelReady()) return;

  channel.publish(
    "user.events",
    "user.created",
    Buffer.from(JSON.stringify(user)),
    { persistent: true }
  );

  console.log("📡 User created event published");
}

// 📦 Seller availability event
function publishSellerAvailability(data) {
  if (!isChannelReady()) return;

  channel.publish(
    "user.events",
    "seller.availability.changed",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log("📦 Seller availability event published");
}

module.exports = {
  connectRabbitMQ,
  publishUserSignup,
  publishUserCreated,
  publishSellerAvailability,
};