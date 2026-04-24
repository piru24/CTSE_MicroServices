require("dotenv").config();
//await amqp.connect("https://rabbitmq.agreeablestone-66d4ad90.southeastasia.azurecontainerapps.io");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

async function startEmailConsumer() {

  try {

    const connection = await amqp.connect("amqp://localhost");

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

            <p>If button doesn't work:</p>
            <p>${verifyLink}</p>
          `
        });

        console.log("✅ Verification email sent to:", data.email);

        channel.ack(msg);

      } catch (err) {

        console.error("❌ Failed to send email:", err);

      }

    });

  } catch (err) {

    console.error("RabbitMQ connection failed:", err);

  }

}

module.exports = { startEmailConsumer };