// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { startDeliveryConsumer } =
require("./services/rabbitmq");

require('dotenv').config();

// Declare port
const PORT = process.env.PORT || 8300;

// Using dependencies
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(bodyParser.json());

const link = "mongodb+srv://Piruthivi:Ruthi24@cluster0.nt1n9me.mongodb.net/food";

// MongoDB connection
mongoose.connect(link)
  .then(() => {
    console.log("Connected to DataBase");
startDeliveryConsumer();

app.listen(PORT, () => {

  console.log(`🚚 Delivery Service running on port ${PORT}`);

});
  })
  .catch((err) => console.log(err));

// Declare Route
const deliveryRouter = require("./routes/delivery-routes");
app.use("/delivery", deliveryRouter);
