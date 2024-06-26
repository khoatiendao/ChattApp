const express = require("express");
const routes = express.Router();
const {registerUser, loginUser, findUser, getAllUser} = require("../controllers/userController");

// API Resgister
routes.post("/register", registerUser);

// API Login
routes.post("/login", loginUser)

// API Get User
routes.get("/find/:userId", findUser);

// API Get all user
routes.get("/", getAllUser)

module.exports = routes;