const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const paramsValidator = require("../middlewares/params-validator");
const userResolver = require("../middlewares/user-resolver");
const transactionService = require("./transaction.service");
const balanceService = require("../balance/balance.service");
const portfolioService = require("../portfolio/portfolio.service");
const transactionUtils = require("./transaction.utils");

async function controller(req, res) {
  const reqTransactionDetails = req.body;

  const invalidTransactionParams = transactionUtils.transactionValidator(
    reqTransactionDetails
  );

  if (invalidTransactionParams) {
    throw new httpError.BadRequest(invalidTransactionParams);
  } else {
    const transactionDetailsParsed = transactionUtils.transactionBuilder(
      reqTransactionDetails
    );

    if (transactionDetailsParsed.type === "deposit") {
      await transactionService.insertTransaction(transactionDetailsParsed);
      await transactionUtils.depositUserBalance(
        transactionDetailsParsed.user,
        transactionDetailsParsed.amount
      );

      res.json({
        success: true,
        data: "transaction inserted and balance updated.",
      });
    }

    if (transactionDetailsParsed.type === "withdrawal") {
      const user = await balanceService.searchUserBalance(
        transactionDetailsParsed.user
      );

      if (!user || user.balance < transactionDetailsParsed.amount) {
        res.json({
          success: false,
          data: "Insufficient funds",
        });
        return;
      }

      await transactionService.insertTransaction(transactionDetailsParsed);
      await transactionUtils.depositUserBalance(
        transactionDetailsParsed.user,
        -transactionDetailsParsed.amount
      );

      res.json({
        success: true,
        data: "transaction inserted and balance updated.",
      });
    }

    if (transactionDetailsParsed.type === "buy") {
      const user = await balanceService.searchUserBalance(
        transactionDetailsParsed.user
      );

      if (
        !user ||
        user.balance <
          transactionDetailsParsed.amount * transactionDetailsParsed.price
      ) {
        res.json({
          success: false,
          data: "Insufficient funds",
        });
        return;
      }

      await transactionService.insertTransaction(transactionDetailsParsed);

      await transactionUtils.depositUserBalance(
        transactionDetailsParsed.user,
        -(transactionDetailsParsed.amount * transactionDetailsParsed.price)
      );

      const existingAssetInPortfolio =
        await portfolioService.searchAssetInPortfolio(
          transactionDetailsParsed.asset,
          transactionDetailsParsed.user
        );

      if (existingAssetInPortfolio) {
        await portfolioService.updateAssetInPortfolio(
          transactionDetailsParsed.asset,
          transactionDetailsParsed.user,
          transactionDetailsParsed.amount,
          transactionDetailsParsed.price
        );

        res.json({
          success: true,
          data: "portfolio updated",
        });
        return;
      }

      const portfolioParams = {};
      Reflect.set(portfolioParams, "type", transactionDetailsParsed.type);
      Reflect.set(portfolioParams, "amount", transactionDetailsParsed.amount);
      Reflect.set(portfolioParams, "price", transactionDetailsParsed.price);
      Reflect.set(portfolioParams, "asset", transactionDetailsParsed.asset);
      Reflect.set(portfolioParams, "date", transactionDetailsParsed.date);

      await portfolioService.insertPortfolio(
        portfolioParams,
        transactionDetailsParsed.user
      );
    }

    if (transactionDetailsParsed.type === "sell") {
      const existingAssetInPortfolio =
        await portfolioService.searchAssetInPortfolio(
          transactionDetailsParsed.asset,
          transactionDetailsParsed.user
        );

      if (!existingAssetInPortfolio) {
        res.json({
          success: false,
          data: "asset not found to sell",
        });
        return;
      }

      if (transactionDetailsParsed.amount > existingAssetInPortfolio.amount ) {
        res.json({
          success: false,
          data: "insufficient amount"
        })
        return;
      }

      await transactionService.insertTransaction(transactionDetailsParsed);

      await transactionUtils.depositUserBalance(
        transactionDetailsParsed.user,
        transactionDetailsParsed.amount * transactionDetailsParsed.price
      );

      await portfolioService.updateAssetInPortfolio(
        transactionDetailsParsed.asset,
        transactionDetailsParsed.user,
        -transactionDetailsParsed.amount,
        transactionDetailsParsed.price
      );

      res.json({
        success: true,
        data: "portfolio updated",
      });
      return;
    }
  }
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["type", "amount", "asset", "price", "date"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  controller,
]);
