const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const portfolioService = require("./portfolio.service");
const transactionService = require("../transactions/transaction.service");

async function controller(req, res) {
  const { user } = req.body;
  const result = {};

  const existingPortfolio = await portfolioService.getAllAssetInPortfolio(
    user.username
  );

  let totalValue = 0;

  if (existingPortfolio.length > 0) {
    existingPortfolio.forEach((asset) => {
      const assetValue = asset.amount * asset.price;
      totalValue += assetValue;
    });
  }

  Reflect.set(result, "totalValueOfThePortfolio", totalValue);

  let netGainFromAsset = 0;
  const assetAllocation = {};
  for (const portfolio of existingPortfolio) {
    let totalPurchaseCost = 0;
    let totalSaleCost = 0;
    let currentValueOfRemainingAsset = 0;

    let totalPurchaseTr = await transactionService.searchTransactionByAssetName(
      "buy",
      portfolio.asset,
      user.username
    );

    for (const tr of totalPurchaseTr) {
      totalPurchaseCost += tr.price * tr.amount;
    }

    let totalSaleTr = await transactionService.searchTransactionByAssetName(
      "sell",
      portfolio.asset,
      user.username
    );

    for (const tr of totalSaleTr) {
      totalSaleCost += tr.price * tr.amount;
    }

    currentValueOfRemainingAsset = portfolio.amount * portfolio.price;
    netGainFromAsset += totalSaleCost + currentValueOfRemainingAsset - totalPurchaseCost;

    Reflect.set(assetAllocation, portfolio.asset, `${currentValueOfRemainingAsset/totalValue*100}%`);
  }

  Reflect.set(result, "netFinancialGain", netGainFromAsset);
  Reflect.set(result, "assetAllocation", assetAllocation)

  res.json(result)
}

module.exports = buildApiHandler([userResolver, controller]);
