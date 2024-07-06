// Importing the express module
const express = require("express");

// API Handler for inserting a new transaction.
const insertTransactionApi = require("./insert-transaction.api");

// Creating a new Router instance.
const router = express.Router();

// Route for inserting a new transaction.
router.post("/", insertTransactionApi);

// Exporting the router to be used in other modules.
module.exports = router;
