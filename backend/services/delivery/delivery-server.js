require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const deliveryRouter = require("./routes/delivery-routes");
const { startDeliveryConsumer } = require("./services/rabbitmq");

const app = express();

const PORT = process.env.PORT || 8300;

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));

app.use(bodyParser.json());

app.use("/delivery", deliveryRouter);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>{

  console.log("MongoDB Connected (Delivery Service)");

  // start rabbitmq consumer
  startDeliveryConsumer();

  app.listen(PORT,()=>{
    console.log(`🚚 Delivery Service running on port ${PORT}`);
  });

})
.catch(err=>{
  console.error("MongoDB connection error:",err);
});