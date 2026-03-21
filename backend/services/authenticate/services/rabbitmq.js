const { initRabbitMQ, getRabbitMQChannel } = require("./rabbitmqClient");

async function connectRabbitMQ() {
  try {
    const channel = await initRabbitMQ("authenticate", 2, 2000);

    if (!channel) {
      return null;
    }

    await channel.assertQueue("user_signup", { durable: true });
    await channel.assertExchange("user.events", "topic", {
      durable: true
    });

    console.log("authenticate RabbitMQ topology ready");
    return channel;
  } catch (error) {
    console.error("authenticate RabbitMQ init failed:", error.message);
    return null;
  }
}


// Email verification event
function publishUserSignup(data) {
  const channel = getRabbitMQChannel();
  if (!channel) {
    console.warn("Skipping publishUserSignup: RabbitMQ channel unavailable");
    return;
  }

  channel.sendToQueue(
    "user_signup",
    Buffer.from(JSON.stringify(data))
  );

  console.log("Signup event sent to Email Service");
}


// Event-driven microservice event
function publishUserCreated(user) {
  const channel = getRabbitMQChannel();
  if (!channel) {
    console.warn("Skipping publishUserCreated: RabbitMQ channel unavailable");
    return;
  }

  channel.publish(
    "user.events",
    "user.created",
    Buffer.from(JSON.stringify(user))
  );

  console.log("User created event published");
}


function publishSellerAvailability(data) {
  const channel = getRabbitMQChannel();
  if (!channel) {
    console.warn("Skipping publishSellerAvailability: RabbitMQ channel unavailable");
    return;
  }

  channel.publish(
    "user.events",
    "seller.availability.changed",
    Buffer.from(JSON.stringify(data))
  );

  console.log("Seller availability event published");
}

module.exports = {
  connectRabbitMQ,
  publishUserSignup,
  publishUserCreated,
  publishSellerAvailability
};