// Importing all the necessary modules.
const buildApiHandler = require("../api-utils/build-api-handler"); // utility to handle all the api's in the router.
const userResolver = require("../middlewares/user-resolver"); // middleware to handle the token verification and authentication.
const portfolioService = require("./portfolio.service"); // service module for portfolio related operations.
const transactionService = require("../transactions/transaction.service"); // service module for transaction related operations.

// controller function for the api to handle the request and send response.
async function controller(req, res) {
  const { user } = req.body; // Fetching the user details from the request.
  const result = {};

  /**
   * Here, the objective is to figure out three portfolio calculations -
   * "total value of the portfolio", "net financial gain" and "asset allocation".
   */

  // Firstly, all the various assets of the user are fetched through this function.
  const existingPortfolio = await portfolioService.getAllAssetInPortfolio(
    user.username
  );

  let totalValue = 0;

  /** The if statement is related to finding out the 1st objective - total value of the portfolio.
      If any asset found in the portfolio of the user, it loops through each asset of the 
      portfolio and adds the amount * price of the asset to total value.
  */
  if (existingPortfolio.length > 0) {
    // adding the amount * price of each asset to the totalValue variable.
    existingPortfolio.forEach((asset) => {
      const assetValue = asset.amount * asset.price;
      totalValue += assetValue;
    });
  }

  // setting the 1st objective to the result, which will be sent as a response from the server at the end.
  Reflect.set(result, "totalValueOfThePortfolio", totalValue);

  /**
   * Now, the remaining two objectives are done in the same for loop.
   */

  let netGainFromAsset = 0;
  const assetAllocation = {};

  // Iterating through each asset in the portfolio to compute net gain and allocation
  for (const portfolio of existingPortfolio) {
    let totalPurchaseCost = 0;
    let totalSaleCost = 0;
    let currentValueOfRemainingAsset = 0;

    // Fetching all "buy" transactions for the current asset
    let totalPurchaseTr = await transactionService.searchTransactionByAssetName(
      "buy",
      portfolio.asset,
      user.username
    );

    // Calculating total purchase cost for the asset
    for (const tr of totalPurchaseTr) {
      totalPurchaseCost += tr.price * tr.amount;
    }

    // Fetching all "sell" transactions for the current asset
    let totalSaleTr = await transactionService.searchTransactionByAssetName(
      "sell",
      portfolio.asset,
      user.username
    );

    // Calculating total sale cost for the asset
    for (const tr of totalSaleTr) {
      totalSaleCost += tr.price * tr.amount;
    }

    // Calculating the current value of the remaining asset
    currentValueOfRemainingAsset = portfolio.amount * portfolio.price;

    // Calculating the net gain from the asset
    netGainFromAsset +=
      totalSaleCost + currentValueOfRemainingAsset - totalPurchaseCost;

    // Calculating the allocation of the asset and storing the asset in assetAllocation object.
    Reflect.set(
      assetAllocation,
      portfolio.asset,
      `${(currentValueOfRemainingAsset / totalValue) * 100}%`
    );
  }

  // Storing net financial gain and asset allocation in the result object
  Reflect.set(result, "netFinancialGain", netGainFromAsset);
  Reflect.set(result, "assetAllocation", assetAllocation);

  res.json({
    success: true,
    data: result,
  });
}

// exporting the api handler to be used in the portfolio router.
module.exports = buildApiHandler([userResolver, controller]);
