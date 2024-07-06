// Importing the database service module and configurations
const database = require("../service-files/database_service");
const config = require("../config");

// Inserts a new portfolio to the user portfolio 
async function insertPortfolio(portfolioDetails, user) {
  return database
    .getCollection(config.COLLECTION_NAME_PORTFOLIO)
    .insertOne({ ...portfolioDetails, user });
}

// Searches for an asset name of the user in the portfolio collection
async function searchAssetInPortfolio(assetName, user) {
  return database
    .getCollection(config.COLLECTION_NAME_PORTFOLIO)
    .findOne({ asset: assetName, user });
}

// gets all the asset of an user with the asset details - "current price", "amount" etc in an array.
async function getAllAssetInPortfolio(user) {
  return database
    .getCollection(config.COLLECTION_NAME_PORTFOLIO)
    .find({ user })
    .toArray();
}

// updates the asset in the users portfolio with the current price of the asset and the updated quantity of the asset.
async function updateAssetInPortfolio(assetName, user, amount, price) {
  return database
    .getCollection(config.COLLECTION_NAME_PORTFOLIO)
    .updateOne(
      { asset: assetName, user },
      { $inc: { amount }, $set: { price } }
    );
}

// exports the function to be used by other modules.
module.exports = {
  insertPortfolio,
  searchAssetInPortfolio,
  getAllAssetInPortfolio,
  updateAssetInPortfolio,
};
