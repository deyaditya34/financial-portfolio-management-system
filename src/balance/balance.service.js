const database = require("../service-files/database_service");
const config = require("../config");

async function insertUserBalance(user, amount) {
  return database
    .getCollection(config.COLLECTION_NAME_BALANCE)
    .insertOne({ user, balance:amount });
}

async function searchUserBalance(user) {
  return database
    .getCollection(config.COLLECTION_NAME_BALANCE)
    .findOne({ user });
}

async function updateUserBalance(user, amount) {
  return database.getCollection(config.COLLECTION_NAME_BALANCE).updateOne({ user }, { $inc: { balance: amount } });
}

module.exports = { insertUserBalance, searchUserBalance, updateUserBalance };
