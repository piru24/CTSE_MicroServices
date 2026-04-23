require('dotenv').config();// Load shared .env file using path attribute

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express();
app.set("trust proxy", 1); // ✅ ADD THIS LINE
const { connectRabbitMQ } =
require("./services/rabbitmq");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet());

app.use(rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100
}));
app.use(cookieParser())
//declare port
const PORT = process.env.PORT || 5000;

const router = require('./routes/user-routes');


app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 VERY IMPORTANT
app.options("*", cors());
app.use(bodyParser.json());
app.use('/user', router)


const link="mongodb+srv://Piruthivi:Ruthi24@cluster0.nt1n9me.mongodb.net/food";

mongoose.connect(link)
  .then(async () => {
    console.log("MongoDB Connected");

    // ✅ DO NOT CRASH IF RABBIT FAILS
    try {
      await connectRabbitMQ();
    } catch (err) {
      console.log("RabbitMQ not running (skipped)");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
  });