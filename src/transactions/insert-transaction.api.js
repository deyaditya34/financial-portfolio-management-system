// Importing the necessary module for handling request errors.
const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler"); // Utility for building api handlers
const paramsValidator = require("../middlewares/params-validator"); // middleware to check for the incomming req params.
const userResolver = require("../middlewares/user-resolver"); // middleware to check the token validity and resolving user authorisation.
const transactionService = require("./transaction.service"); // service module for transaction related database operations.
const balanceService = require("../balance/balance.service"); // service module for balance related database operations.
const portfolioService = require("../portfolio/portfolio.service"); // service module for database related database operations.
const transactionUtils = require("./transaction.utils"); // utility module related to transaction operations.

// Main function of the creating transaction, that involves the "DEPOSIT", "WITHDRAWAL", "BUY", "SELL", "USER BALANCE" and "PORTFOLIO UPDATION"  
async function controller(req, res) {
  // Extracting the transaction details from the request
  const reqTransactionDetails = req.body;

  // validating the transaction params. (Details about the 'transactionValidator' function is covered in transactionUtils module.)
  const invalidTransactionParams = transactionUtils.transactionValidator(
    reqTransactionDetails
  );

  // if invalid transaction params found, the server throws an error and ends the response.
  if (invalidTransactionParams) {
    throw new httpError.BadRequest(invalidTransactionParams);
  } else {
    // Here, the transaction params are built according for transaction insertions in DB, balance updations and portfolio related calculation. The details will be covered below. 
    const transactionDetailsParsed = transactionUtils.transactionBuilder(
      reqTransactionDetails
    );

    /**
     * Here, all the four types of transactions, "DEPOSIT", "WITHDRAWAL", "BUY", "SELL" are covered in 4 separate if statements. The details are as follows-
     */

    // If statement for the type "deposit"
    if (transactionDetailsParsed.type === "deposit") {
      await transactionService.insertTransaction(transactionDetailsParsed); // The transaction is inserted in the transaction collection.
      // adding the amount with the previous balance. The details of the function is covered in the transactionUtils module.
      await transactionUtils.updateUserBalance(
        transactionDetailsParsed.user,
        transactionDetailsParsed.amount
      ); 

      // sending the response and ending the response.
      res.json({
        success: true,
        data: "transaction inserted and balance updated.",
      });
      return;
    }

    // If statement for the type "withdrawal"
    if (transactionDetailsParsed.type === "withdrawal") {
      // Firstly, the server has to fetch the balance of the user before allowing to withdraw funds.
      const user = await balanceService.searchUserBalance(
        transactionDetailsParsed.user
      );

      // Here, the if statement checks wherther the user has sufficient funds to withdraw and if not, the server returns a false status and ends the response.
      if (!user || user.balance < transactionDetailsParsed.amount) {
        res.json({
          success: false,
          data: "Insufficient funds",
        });
        return;
      }

      // After veryfying the fund status, the server inserts the transaction in the transaction collection.
      await transactionService.insertTransaction(transactionDetailsParsed);
       // Deducting the amount from the previous balance. The details of the function is covered in the transactionUtils module.
      await transactionUtils.updateUserBalance(
        transactionDetailsParsed.user,
        -transactionDetailsParsed.amount
      );

       // sending the response and ending the it.
      res.json({
        success: true,
        data: "transaction inserted and balance updated.",
      });
    }

    // If statement for the type "BUY"
    if (transactionDetailsParsed.type === "buy") {
      // Fetching the current balance of the user in order to purchase the asset.
      const user = await balanceService.searchUserBalance(
        transactionDetailsParsed.user
      );

      // Validating, whether the user has sufficient funds to buy the required amount of asset.
      if (
        !user ||
        user.balance <
          transactionDetailsParsed.amount * transactionDetailsParsed.price
      ) {
        // If the user does not have sufficient funds, the server sends a false response and ends it.
        res.json({
          success: false,
          data: "Insufficient funds",
        });
        return;
      }

      // After veryfying the fund status, the server inserts the transaction in the transaction collection. 
      await transactionService.insertTransaction(transactionDetailsParsed);

      // Deducting the amount from the previous balance. The details of the function is covered in the transactionUtils module.
      await transactionUtils.updateUserBalance(
        transactionDetailsParsed.user,
        -(transactionDetailsParsed.amount * transactionDetailsParsed.price)
      );

      // Checks, whether the user has purchased the asset earlier or not.
      const existingAssetInPortfolio =
        await portfolioService.searchAssetInPortfolio(
          transactionDetailsParsed.asset,
          transactionDetailsParsed.user
        );
      
      // If previous ownership of the asset found, "updateAssetInPortfolio" function updates the portfolio of the user with the increase amount and the current price.  
      if (existingAssetInPortfolio) {
        await portfolioService.updateAssetInPortfolio(
          transactionDetailsParsed.asset,
          transactionDetailsParsed.user,
          transactionDetailsParsed.amount,
          transactionDetailsParsed.price
        );

        // After updating the portfolio, the server sends a response and ends.
        res.json({
          success: true,
          data: "transaction created, balance and portfolio updated.",
        });
        return;
      }

      // If previous ownership of the asset not found, all the necessary transaction params are included in "portfolioParams"
      const portfolioParams = {};
      Reflect.set(portfolioParams, "type", transactionDetailsParsed.type);
      Reflect.set(portfolioParams, "amount", transactionDetailsParsed.amount);
      Reflect.set(portfolioParams, "price", transactionDetailsParsed.price);
      Reflect.set(portfolioParams, "asset", transactionDetailsParsed.asset);
      Reflect.set(portfolioParams, "date", transactionDetailsParsed.date);

      // Here the portfolioParams along with the user details are inserted in the portfolio collection.
      await portfolioService.insertPortfolio(
        portfolioParams,
        transactionDetailsParsed.user
      );

      // The server sends a response and ends it.
      res.json({
        success: true,
        data: "transaction and portfolio created, balance updated."
      })
    }

    // If statement for the "SELL" type transaction
    if (transactionDetailsParsed.type === "sell") {
      // This function fetches the users particular asset portfolio to validate against the amount and the asset.
      const existingAssetInPortfolio =
        await portfolioService.searchAssetInPortfolio(
          transactionDetailsParsed.asset,
          transactionDetailsParsed.user
        );
      
       
      if (!existingAssetInPortfolio) {
      // if the user have not purchased the asset earlier, the server sends a false response and ends it.
        res.json({
          success: false,
          data: "asset not found to sell",
        });
        return;
      }

      if (transactionDetailsParsed.amount > existingAssetInPortfolio.amount ) {
        // If the user does not have the required amount to sell, the server sends a false response and ends it.
        res.json({
          success: false,
          data: "insufficient amount"
        })
        return;
      }

      // After validating, the sell transaction is inserted in the transaction collection.
      await transactionService.insertTransaction(transactionDetailsParsed);

      // Adding the amount to the previous balance. The details of the function is covered in the transactionUtils module. 
      await transactionUtils.updateUserBalance(
        transactionDetailsParsed.user,
        transactionDetailsParsed.amount * transactionDetailsParsed.price
      );

      // "updateAssetInPortfolio" function updates the portfolio of the user with the decrease amount and the current price.
      await portfolioService.updateAssetInPortfolio(
        transactionDetailsParsed.asset,
        transactionDetailsParsed.user,
        -transactionDetailsParsed.amount,
        transactionDetailsParsed.price
      );  

      // The server sends a success response and ends it.
      res.json({
        success: true,
        data: "transaction created, balance and portfolio updated",
      });
      return;
    }
  }
}

// This middleware checks the necessary params needed for the create transaction api. The details of this function is covered in the middlewares/params-validator module.
const missingParamsValidator = paramsValidator.createParamsValidator(
  ["type", "amount", "asset", "price", "date"],
  paramsValidator.PARAM_KEY.BODY
);

// Exporting the API handler to be used in the transaction router.
module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  controller,
]);
