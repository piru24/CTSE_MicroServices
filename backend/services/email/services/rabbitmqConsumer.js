require("dotenv").config();
const amqp = require("amqplib");
const nodemailer = require("nodemailer");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

async function connectRabbitMQ(retries = 5) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log("✅ Email Service connected to RabbitMQ");
    return connection;
  } catch (err) {
    console.log(`❌ RabbitMQ not ready, retrying... (${retries})`);

    if (retries === 0) {
      console.error("❌ Email Service failed to connect to RabbitMQ");
      return null;
    }

    await new Promise(res => setTimeout(res, 5000));
    return connectRabbitMQ(retries - 1);
  }
}

async function startEmailConsumer() {
  const connection = await connectRabbitMQ();

  if (!connection) return;

  const channel = await connection.createChannel();

  await channel.assertQueue("user_signup", { durable: true });

  console.log("📧 Email Service listening for signup events...");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  channel.consume("user_signup", async (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("📩 Signup event received:", data);

    const verifyLink =
      `https://auth-service.agreeablestone-66d4ad90.southeastasia.azurecontainerapps.io/user/verify/${data.token}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: "Verify Your Account",
        html: `
          <h2>Email Verification</h2>
          <p>Click the button below to verify your account:</p>
          <a href="${verifyLink}"
          style="padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
          Verify Account
          </a>
          <p>${verifyLink}</p>
        `
      });

      console.log("✅ Email sent:", data.email);
      channel.ack(msg);

    } catch (err) {
      console.error("❌ Email send failed:", err);
    }
  });
}

module.exports = { startEmailConsumer };