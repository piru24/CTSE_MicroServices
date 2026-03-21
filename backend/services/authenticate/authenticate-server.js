require('dotenv').config();// Load shared .env file using path attribute

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express();
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
const PORT = process.env.PORT || 8090;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const router = require('./routes/user-routes');

//using dependencies
app.use(cors({credentials: true, origin: allowedOrigins}));
app.use(bodyParser.json());
app.use('/user', router)

const link = process.env.MONGO_URI || "mongodb://localhost:27017/ctse_food";

mongoose.connect(link, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 });

 
 const connection = mongoose.connection;
  connection.once("open", async () => {

  console.log("MongoDB Connection Success!");

    try {
        await connectRabbitMQ();
    } catch (error) {
        console.warn("Authenticate service started without RabbitMQ:", error.message);
    }

});

 app.listen(PORT, () => {
     console.log(`Authentication Server is up and running on Port: ${PORT}`)
 });