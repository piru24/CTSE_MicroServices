//import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();
const { closeRabbitMQ } = require('./messaging/rabbitmqPublisher');

require('dotenv').config();

//declare port
const PORT = process.env.PORT || 8500;
app.use(cookieParser());

app.use(cors({credentials: true, origin: "http://localhost:3000"}));

app.use(bodyParser.json());

app.listen(PORT, () => {
	console.log(`Payment Server is up and running on Port: ${PORT}`)
});

process.on('SIGINT', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeRabbitMQ();
  process.exit(0);
});

// Declare Route
const paymentRouter = require("./routes/payment-routes");
app.use("/payment", paymentRouter);