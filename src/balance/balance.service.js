// Importing the database module and the configurations
const database = require("../service-files/database_service");
const config = require("../config");

// Inserts the balance to the user in the balance collection
async function insertUserBalance(user, amount) {
  return database
    .getCollection(config.COLLECTION_NAME_BALANCE)
    .insertOne({ user, balance:amount });
}

// Searches for the balance of the user in the balance collection
async function searchUserBalance(user) {
  return database
    .getCollection(config.COLLECTION_NAME_BALANCE)
    .findOne({ user });
}

// Updates the balance of the user with the amount in the balance collection
async function updateUserBalance(user, amount) {
  return database.getCollection(config.COLLECTION_NAME_BALANCE).updateOne({ user }, { $inc: { balance: amount } });
}

// Exporting the functions to be used by other modules.
module.exports = { insertUserBalance, searchUserBalance, updateUserBalance };
