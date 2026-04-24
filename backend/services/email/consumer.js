require("dotenv").config();
const amqp = require("amqplib");
const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function startConsumer() {

  try {

    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://rabbitmq");

    const channel = await connection.createChannel();

    // Create queue if not exists
    const queue = "user_signup";
    await channel.assertQueue(queue, { durable: true });

    console.log("📧 Email Service listening for signup events...");

    channel.consume(queue, async (msg) => {

      if (msg !== null) {

        const data = JSON.parse(msg.content.toString());

        console.log("📩 Signup event received:", data);

        const verifyLink =
          `http://localhost:5000/user/verify/${data.token}`;

        try {

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: data.email,
            subject: "Verify Your Account",
           html: `
  <h2>Email Verification</h2>
  <p>Click the button below to verify your account:</p>

  <a href="${verifyLink}" 
     style="
        display:inline-block;
        padding:12px 20px;
        background-color:#4CAF50;
        color:white;
        text-decoration:none;
        border-radius:5px;
        font-weight:bold;
     ">
     Verify Account
  </a>

  <p>If the button does not work, copy and paste this link:</p>
  <p>${verifyLink}</p>
`
          });

          console.log("✅ Verification email sent to:", data.email);

          channel.ack(msg);

        } catch (emailError) {

          console.error("❌ Failed to send email:", emailError);

        }

      }

    });

  } catch (err) {

    console.error("❌ RabbitMQ connection failed:", err);

  }

}

startConsumer();