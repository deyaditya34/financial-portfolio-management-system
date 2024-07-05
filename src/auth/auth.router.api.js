const express = require("express");

const registerUserApi = require("./auth.register.api");
const loginuserApi = require("./auth.login.api");

const router = express.Router();

router.post("/register", registerUserApi);
router.post("/login", loginuserApi);

module.exports = router;
