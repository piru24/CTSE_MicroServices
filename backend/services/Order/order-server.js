require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger.json");

const router = require("./order-route/order-route");
const { connectRabbitMQ } = require("./services/rabbitmqPublisher");
const { notFound, errorHandler } = require("./services/error-handler");

const app = express();
const PORT = Number(process.env.PORT || 8020);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const ALLOWED_ORIGINS = CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(cookieParser());

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  next();
});

app.use("/order", router);
app.use("/order/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/order/docs.json", (req, res) => {
  return res.status(200).json(swaggerSpec);
});
app.use(notFound);
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connection Success!");

  app.listen(PORT, async () => {

    // connect RabbitMQ publisher
    await connectRabbitMQ();

    console.log(`Order Service running on port ${PORT}`);

  });

})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
});