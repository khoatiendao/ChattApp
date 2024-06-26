const express = require("express");
const routes = express.Router();
const {createChat, findUserChat, findChats} = require("../controllers/chatController");


// Api chat
routes.post("/", createChat)
routes.get("/:userId", findUserChat)
routes.post("/find/:firstId/:secondId", findChats)

module.exports = routes;