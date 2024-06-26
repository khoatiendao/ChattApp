const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
require("dotenv").config();

mongoose.connect(DB_URL + DB_NAME , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected Mongoose Successfull")).catch((error) => console.log("Connected Failed", error.message))