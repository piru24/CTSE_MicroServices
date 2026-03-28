//import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const app = express();
const { closeRabbitMQ } = require('./messaging/rabbitmqPublisher');

require('dotenv').config();

//declare port
const PORT = process.env.PORT || 8500;
app.use(cookieParser());

app.use(cors({credentials: true, origin: "http://localhost:3000"}));

app.use(bodyParser.json());

// Declare Route
const paymentRouter = require("./routes/payment-routes");
app.use("/payment", paymentRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Payment Server is up and running on Port: ${PORT}`);
});

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI not set; payment persistence will fail until configured");
}

process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});
