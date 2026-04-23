const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
let connection;
let channel;

const ensureChannel = async () => {
  if (channel) {
    return channel;
  }

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  connection.on('close', () => {
    connection = null;
    channel = null;
  });

  connection.on('error', () => {
    connection = null;
    channel = null;
  });

  return channel;
};

const publishToQueue = async (queueName, payload) => {
  const activeChannel = await ensureChannel();
  await activeChannel.assertQueue(queueName, { durable: true });
  activeChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
    persistent: true
  });
};

const closeRabbitMQ = async () => {
  if (channel) {
    await channel.close();
    channel = null;
  }

  if (connection) {
    await connection.close();
    connection = null;
  }
};

module.exports = {
  publishToQueue,
  closeRabbitMQ
};
