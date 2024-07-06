const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const transactionService = require("../transactions/transaction.service");

async function controller(req, res) {
  const { user } = req.body;

  const existingTransactions = await transactionService.searchTransaction(
    user.username
  );

  if (!existingTransactions) {
    res.json({
      success: false,
      data: "No transaction found for the user",
    });
    return;
  }

  res.json({
    success: true,
    data: existingTransactions,
  });
}

module.exports = buildApiHandler([userResolver, controller]);
