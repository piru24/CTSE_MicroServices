// Import dependencies
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { startDeliveryConsumer } = require("./services/rabbitmq");
const deliveryRouter = require("./routes/delivery-routes");

const app = express();

// Port
const PORT = process.env.PORT || 8300;

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.json());

// Routes
app.use("/delivery", deliveryRouter);


// MongoDB connection (USE ENV VARIABLE)
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected (Delivery Service)");

  // Start RabbitMQ consumer
  startDeliveryConsumer();

  app.listen(PORT, () => {
    console.log(`Delivery Service running on port ${PORT}`);
  });

})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});