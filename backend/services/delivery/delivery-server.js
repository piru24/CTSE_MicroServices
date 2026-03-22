require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const deliveryRouter = require("./routes/delivery-routes");

const app = express();
const PORT = process.env.PORT || 8300;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/delivery", deliveryRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected (Delivery Service)");


  app.listen(PORT, () => {
    console.log(`🚚 Delivery Service running on port ${PORT}`);
  });

})
.catch(err => {
  console.error("MongoDB connection error:", err);
});