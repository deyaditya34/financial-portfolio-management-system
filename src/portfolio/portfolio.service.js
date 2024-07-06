const database = require("../service-files/database_service");
const config = require("../config");

async function insertPortfolio(portfolioDetails, user) {
  return database
    .getCollection(config.COLLECTION_NAME_PORTFOLIO)
    .insertOne({ ...portfolioDetails, user });
}

async function searchAssetInPortfolio(assetName, user) {
  return database
    .getCollection(config.COLLECTION_NAME_PORTFOLIO)
    .findOne({ asset: assetName, user });
}

async function updateAssetInPortfolio(assetName, user, amount, price) {
  return database
    .getCollection(config.COLLECTION_NAME_PORTFOLIO)
    .updateOne(
      { asset: assetName, user },
      { $inc: { amount }, $set: { price } },
    );
}

module.exports = {
  insertPortfolio,
  searchAssetInPortfolio,
  updateAssetInPortfolio,
};
