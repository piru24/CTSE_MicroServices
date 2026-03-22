require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const router = require("./order-route/order-route");

const app = express();
const PORT = process.env.PORT || 8020;

// Middleware
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}));

app.use(express.json());

// Routes
app.use("/order", router);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connection Success!");

  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });

})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});