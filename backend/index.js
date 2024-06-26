const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./src/Routes/userRoutes");
const chatRoutes = require("./src/Routes/chatRoutes");
const messageRoutes = require("./src/Routes/messageRoutes");
const mongoose = require("./config/dbConfig");


app.use(express.json());
app.use(cors({origin: true}));

app.get("/", async(req, res) => {
    return res.send("This is my chat")
})

// User routes
app.use("/api/v1/user", userRoutes);

// Chat routes
app.use("/api/v1/chat", chatRoutes);

// Message routes
app.use("/api/v1/message", messageRoutes)

// app.post("/authenication", async(req, res) => {
//     const {username} = req.body;
//     return res.json({ username: username });
// });

app.listen(PORT, (req, res) => {
    console.log(`Server is running on PORT: ${PORT}`);
});
