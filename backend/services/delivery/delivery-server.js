// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

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

    // Start the server only after the DB connection is successful
    app.listen(PORT, () => {
      console.log(`Delivery Server is up and running on Port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// Declare Route
const deliveryRouter = require("./routes/delivery-routes");
app.use("/delivery", deliveryRouter);
