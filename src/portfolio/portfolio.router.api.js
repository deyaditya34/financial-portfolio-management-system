const express = require("express");

const getUserTrHistoryApi = require("./get-transaction-history.api");
const getPortfolioApi = require("./get-portfolio.api");

const router = express.Router();

router.get("/", getPortfolioApi)
router.get("/history", getUserTrHistoryApi);

module.exports = router;
