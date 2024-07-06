// Importing the database service module and configurations
const database = require("../service-files/database_service");
const config = require("../config");

// Function to insert a new transaction
async function insertTransaction(transactionDetails) {
  return database
    .getCollection(config.COLLECTION_NAME_TRANSACTIONS)
    .insertOne(transactionDetails);
}

// Function to search for all the transactions against a user.
async function searchTransaction(username) {
  return database
    .getCollection(config.COLLECTION_NAME_TRANSACTIONS)
    .find({ user: username })
    .toArray();
}

// Function to search for all the transaction of the "BUY" or "SELL" of an "ASSET" against a user.
async function searchTransactionByAssetName(type, assetName, username) {
  return database
    .getCollection(config.COLLECTION_NAME_TRANSACTIONS)
    .find({ type: type, asset: assetName, user: username })
    .toArray();
}

// Exporting the functions to be used in other modules.
module.exports = {
  insertTransaction,
  searchTransaction,
  searchTransactionByAssetName,
};
