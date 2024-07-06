const database = require("../service-files/database_service");
const config = require("../config");

async function insertTransaction(transactionDetails) {
  return database
    .getCollection(config.COLLECTION_NAME_TRANSACTIONS)
    .insertOne(transactionDetails);
}

async function searchTransaction(username) {
  return database
    .getCollection(config.COLLECTION_NAME_TRANSACTIONS)
    .find({ user: username })
    .toArray();
}

async function searchTransactionByAssetName(type, assetName, username) {
  return database
    .getCollection(config.COLLECTION_NAME_TRANSACTIONS)
    .find({ type: type, asset: assetName, user: username })
    .toArray();
}

module.exports = {
  insertTransaction,
  searchTransaction,
  searchTransactionByAssetName,
};
