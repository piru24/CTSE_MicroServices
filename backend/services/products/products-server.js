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
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//using dependencies
app.use(cors({credentials: true, origin: ["http://localhost:3000", "http://food-app.127.0.0.1.nip.io"]
}));
app.use(bodyParser.json());
app.use("/products",router)
// MongoDB connection (USE ENV VARIABLE)
mongoose.connect(process.env.MONGO_URI)
.then(async () => {

  console.log("MongoDB Connected");

  await startSellerAvailabilityConsumer();

  app.listen(PORT, () => {
    console.log(`Products Server is running on port ${PORT}`);
  });

});
