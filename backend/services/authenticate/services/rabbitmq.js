const amqp = require("amqplib");

let channel = null;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    // Queue for email verification
    await channel.assertQueue("user_signup", { durable: true });

    // Exchange for microservice events
    await channel.assertExchange("user.events", "topic", {
      durable: true
    });

    console.log("RabbitMQ connected");

  } catch (error) {
    console.log("RabbitMQ connection failed:", error.message);
  }
}


// Email verification event
function publishUserSignup(data) {

  if (!channel) {
    console.log("RabbitMQ not ready. Skipping user_signup event.");
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

  if (!channel) {
    console.log("RabbitMQ not ready. Skipping user_created event.");
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

  if (!channel) {
    console.log("RabbitMQ not ready. Skipping seller availability event.");
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