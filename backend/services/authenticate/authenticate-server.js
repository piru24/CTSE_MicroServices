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

const router = require('./routes/user-routes');

//using dependencies
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(bodyParser.json());
app.use('/user', router)


const link="mongodb+srv://Piruthivi:Ruthi24@cluster0.nt1n9me.mongodb.net/food";

mongoose.connect(link, {
    useNewUrlParser: true,
    useUnifiedTopology: true
 });

 
 const connection = mongoose.connection;
  connection.once("open", async () => {

  console.log("MongoDB Connection Success!");

  await connectRabbitMQ();

});

 app.listen(PORT, () => {
     console.log(`Authentication Server is up and running on Port: ${PORT}`)
 });