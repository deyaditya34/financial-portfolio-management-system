const database = require("../service-files/database_service");
const config = require("../config");

async function insertTransaction(transactionDetails) {
  return database
    .getCollection(config.COLLECTION_NAME_TRANSACTIONS)
    .insertOne(transactionDetails);
}


module.exports = { insertTransaction };
