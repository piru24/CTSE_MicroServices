require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { connectRabbitMQ } = require("./services/rabbitmq");

const app = express();

// ---------------- SECURITY ----------------
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

// ---------------- MIDDLEWARE ----------------
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));

app.use(bodyParser.json());

// ---------------- ROUTES ----------------
const router = require("./routes/user-routes");
app.use("/user", router);

// ---------------- PORT ----------------
const PORT = process.env.PORT || 8090;

// ---------------- DATABASE ----------------
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

const connection = mongoose.connection;

connection.once("open", async () => {

  console.log("MongoDB Connection Success!");

  // Try RabbitMQ but don't crash if not running
  try {
    await connectRabbitMQ();
  } catch (err) {
    console.log("RabbitMQ not running (skipped)");
  }

});

// ---------------- SERVER ----------------
app.listen(PORT, () => {
  console.log(`Authentication Server is up and running on Port: ${PORT}`);
});