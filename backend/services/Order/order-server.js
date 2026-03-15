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

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}));

app.use(bodyParser.json());

app.use("/order", router);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connection Success!");

  app.listen(PORT, async () => {

    console.log(`Order Service running on port ${PORT}`);

    // connect RabbitMQ publisher
    await connectRabbitMQ();

  });

})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});