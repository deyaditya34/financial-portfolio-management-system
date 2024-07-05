const express = require("express");

const insertTransactionApi = require("./insert-transaction.api");

const router = express.Router();

router.post("/", insertTransactionApi);

module.exports = router;
