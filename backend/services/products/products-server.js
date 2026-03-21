require('dotenv').config();// Load shared .env file using path attribute
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const router = require("./routes/products-routs");
const app = express();
const { startSellerAvailabilityConsumer } = require("./services/rabbitmqConsumer");
//declare port
const PORT = process.env.PORT || 8070;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//using dependencies
app.use(cors({credentials: true, origin: allowedOrigins}));
app.use(bodyParser.json());
app.use("/products",router)
const link = process.env.MONGO_URI || "mongodb://localhost:27017/ctse_food";

mongoose.connect(link, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once("open", async () => {

  console.log("MongoDB Connected");

  await startSellerAvailabilityConsumer();

  app.listen(PORT, () => {
    console.log(`Products Server is running on port ${PORT}`);
  });

});
