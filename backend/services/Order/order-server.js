require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const router = require("./order-route/order-route");
const app = express();
const cookieParser = require('cookie-parser');
const { startUserCreatedConsumer } =
require("./services/rabbitmqConsumer");
const { initOrderEventPublisher } = require("./services/rabbitmqPublisher");
const openApiDoc = require("./docs/openapi.json");

//declare port
const PORT = process.env.PORT || 8020; 
app.use(cookieParser());

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300
  })
);

//using dependencies
app.use(cors({
  credentials: true,
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "order-service",
    timestamp: new Date().toISOString()
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

// Keep both mounts to preserve old integrations and frontend compatibility.
app.use("/order", router);
app.use("/Order", router);

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ctse_food";

const start = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB Connection Success!");

    app.listen(PORT, async () => {
      console.log(`Order Service running on port ${PORT}`);

      await Promise.all([
        startUserCreatedConsumer(),
        initOrderEventPublisher()
      ]);
    });
  } catch (error) {
    console.error("Order Service startup failed:", error);
    process.exit(1);
  }
};

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  return res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

start();
