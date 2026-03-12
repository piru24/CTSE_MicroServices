const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {

  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  channel = await connection.createChannel();

  // Queue for email verification
  await channel.assertQueue("user_signup", { durable: true });

  // Exchange for microservice events
  await channel.assertExchange("user.events", "topic", {
    durable: true
  });

  console.log("RabbitMQ connected");
}


// Email verification event
function publishUserSignup(data) {

  channel.sendToQueue(
    "user_signup",
    Buffer.from(JSON.stringify(data))
  );

  console.log("Signup event sent to Email Service");
}


// Event-driven microservice event
function publishUserCreated(user) {

  channel.publish(
    "user.events",
    "user.created",
    Buffer.from(JSON.stringify(user))
  );

  console.log("User created event published");
}


function publishSellerAvailability(data) {

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