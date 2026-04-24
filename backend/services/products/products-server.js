require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const router = require("./routes/products-routs");
const { startSellerAvailabilityConsumer } = require("./services/rabbitmqConsumer");

const app = express();

// ✅ Use dynamic port (Azure compatible)
const PORT = process.env.PORT || 8072;

// Middlewares
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ FIXED CORS (allow all for now)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-domain.com"
  ],
  credentials: true
}));

app.use(bodyParser.json());

// Routes
app.use("/products", router);

// ✅ MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("✅ MongoDB Connected");

  // ✅ Start RabbitMQ but don’t block app
  startSellerAvailabilityConsumer().catch(err =>
    console.error("RabbitMQ consumer error:", err)
  );

  app.listen(PORT, () => {
    console.log(`🚀 Product Service running on port ${PORT}`);
  });

})
.catch(err => {
  console.error("❌ MongoDB connection failed:", err);
});