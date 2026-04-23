require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const router = require("./order-route/order-route");
const { connectRabbitMQ } = require("./services/rabbitmqPublisher");

const app = express();
const PORT = process.env.PORT || 8020;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cookieParser());

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}));

app.use(bodyParser.json());

app.get("/order/health", (req, res) => {
  res.status(200).json({ status: "Order Service is healthy" });
});

app.get("/order/ready", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ status: "Order Service is ready" });
  }

  return res.status(503).json({ status: "Order Service is not ready" });
});

app.use("/order", router);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connection Success!");

  const server = app.listen(PORT, async () => {

    console.log(`Order Service running on port ${PORT}`);

    // connect RabbitMQ publisher
    await connectRabbitMQ();

  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the existing process or start this service with a different PORT.`);
      return;
    }

    console.error("Server startup error:", err);
  });

})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
