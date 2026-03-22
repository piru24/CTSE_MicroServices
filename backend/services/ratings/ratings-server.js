require('dotenv').config();// Load shared .env file using path attribute
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/review-routes");
const app = express();
const cookieParser = require('cookie-parser');

//declare port
const PORT = process.env.PORT || 8079;
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000/",
  credentials: true
}));

app.use(bodyParser.json());
app.use("/review",router)

mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
	useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB Connection Success!");
});

app.listen(PORT, () => {
	console.log(`Ratings Server is up and running on Port: ${PORT}`)
});