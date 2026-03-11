require('dotenv').config();// Load shared .env file using path attribute
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./cart-routes/cart-routes");
const app = express();

//declare port
const PORT = process.env.PORT || 8050;

//using dependencies
app.use(cors());
app.use(bodyParser.json());
app.use("/cart",router)
const link="mongodb+srv://Piruthivi:Ruthi24@cluster0.nt1n9me.mongodb.net/food";

mongoose.connect(link, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection
    = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB Connection Success!");
}
);
app.listen(PORT, () => {
    console.log(`Cart Server is up and running on Port: ${PORT}`)
});
// mongoose.connect(link)
// 	.then(()=>console.log("Connected to DataBase"))
//     .then(() =>{
//         app.listen(PORT)
//     }).catch((err)=>console.log(err));
