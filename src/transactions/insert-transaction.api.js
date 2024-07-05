const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const paramsValidator = require("../middlewares/params-validator");
const userResolver = require("../middlewares/user-resolver");
const transactionService = require("./transaction.service");
const transactionUtils = require("./transaction.utils");

async function controller(req, res) {
  const reqTransactionDetails = req.body;

  const invalidTransactionParams = transactionUtils.transactionValidator(
    reqTransactionDetails
  );

  if (invalidTransactionParams) {
    throw new httpError.BadRequest(invalidTransactionParams);
  } else {
    const trannsactionDetailsParsed = transactionUtils.transactionBuilder(
      reqTransactionDetails
    );

    const result = await transactionService.insertTransaction(
      trannsactionDetailsParsed
    );

    res.json({
      success: result.acknowledged,
      data: result.insertedId,
    });
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
