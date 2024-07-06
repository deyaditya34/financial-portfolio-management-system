// Importing the api handlers, middlewares and the transaction service module.
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const transactionService = require("../transactions/transaction.service");

// main function to handle the HTTP request.
async function controller(req, res) {
  // Fetching the user details from the request.
  const { user } = req.body;

  // Searching for transactions against the user.
  const existingTransactions = await transactionService.searchTransaction(
    user.username
  );  

  // if no transaction found, the server sends a false response and ends it.
  if (!existingTransactions) {
    res.json({
      success: false,
      data: "No transaction found for the user",
    });
    return;
  }

  // Else, the server sends all the transactions associated with user.
  res.json({
    success: true,
    data: existingTransactions,
  });
}

// Exporting the api handler to be used in the portfolio router.
module.exports = buildApiHandler([userResolver, controller]);
