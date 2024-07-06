// Importing the express library
const express = require("express");

// Importing the required api modules for the portfolio router.
const getUserTrHistoryApi = require("./get-transaction-history.api"); 
const getPortfolioApi = require("./get-portfolio.api"); 

// creating an instance of router from express library.
const router = express.Router();


router.get("/", getPortfolioApi) // route related to the users net financial gain, asset allocation and total value of the portfolio.
router.get("/history", getUserTrHistoryApi); // route related to all the user transaction history.

module.exports = router;
