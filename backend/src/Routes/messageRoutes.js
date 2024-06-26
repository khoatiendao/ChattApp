const express = require("express");
const routes = express.Router();
const {createMessage, getMessage} = require("../controllers/messageController")

routes.post("/", createMessage);
routes.get("/:chatId", getMessage);

module.exports = routes;