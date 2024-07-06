const express = require("express");

// Importing the api handlers for user registration and login
const registerUserApi = require("./auth.register.api");
const loginuserApi = require("./auth.login.api");

// Creating an instance of Express Router
const router = express.Router();

router.post("/register", registerUserApi); // POST route for user registration using the registerUserApi
router.post("/login", loginuserApi); // POST route for login user using the loginUserApi

//Exporting the router to be used in other modules
module.exports = router;
