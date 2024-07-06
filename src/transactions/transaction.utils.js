const balanceService = require("../balance/balance.service");

function transactionValidator(transactionDetails) {
  let invalidStringTypeParams = [];
  let invalidTransactionType = "";
  let invalidNumberTypeParams = [];
  let invalidDateTypeParams = [];

  if (typeof transactionDetails.amount !== "number") {
    invalidNumberTypeParams.push(transactionDetails.amount);
  }

  if (Reflect.has(transactionDetails, "price")) {
    if (typeof transactionDetails.price !== "number") {
      invalidNumberTypeParams.push(transactionDetails.price);
    }
  }

  if (typeof transactionDetails.date !== "string") {
    invalidDateTypeParams.push(transactionDetails.date);
  } else if (isNaN(new Date(transactionDetails.date))) {
    invalidDateTypeParams.push(transactionDetails.date);
  }

  if (Reflect.has(transactionDetails, "asset")) {
    if (typeof transactionDetails.asset !== "string") {
      invalidStringTypeParams.push(transactionDetails.asset);
    }
  }

  if (typeof transactionDetails.type !== "string") {
    invalidTransactionType = transactionDetails.type;
  } else if (
    transactionDetails.type !== "deposit" &&
    transactionDetails.type !== "withdrawal" &&
    transactionDetails.type !== "buy" &&
    transactionDetails.type !== "sell"
  ) {
    invalidTransactionType = transactionDetails.type;
  }

  let result = "invalid params :";

  if (invalidNumberTypeParams.length > 0) {
    result += `values '${invalidNumberTypeParams.join(
      ","
    )}' should be 'number' type, `;
  }

  if (invalidStringTypeParams.length > 0) {
    result += `values '${invalidStringTypeParams.join(
      ","
    )}' should be 'string' type.`;
  }

  if (invalidDateTypeParams.length > 0) {
    result += `values '${invalidStringTypeParams.join(
      ","
    )}' should be 'yyyy-mm-dd' and 'string' type.`;
  }

  if (invalidTransactionType.length > 0) {
    result += `type - '${invalidTransactionType}' should be 'string' type and between 'deposit', 'withdrawal', 'buy' or 'sell'.`;
  }

  if (result.length > 17) {
    return result;
  }

  return null;
}

function transactionBuilder(transactionDetails) {
  const result = {};

  if (
    transactionDetails.type === "deposit" ||
    transactionDetails.type === "withdrawal"
  ) {
    Reflect.set(result, "amount", Number(transactionDetails.amount));
    Reflect.set(result, "date", new Date(transactionDetails.date));
    Reflect.set(result, "type", transactionDetails.type);
    Reflect.set(result, "user", transactionDetails.user.username);
  } else {
    Reflect.set(result, "type", transactionDetails.type);
    Reflect.set(result, "asset", transactionDetails.asset);
    Reflect.set(result, "amount", Number(transactionDetails.amount));
    Reflect.set(result, "price", Number(transactionDetails.price));
    Reflect.set(result, "date", new Date(transactionDetails.date));
    Reflect.set(result, "user", transactionDetails.user.username);
  }

  return result;
}

async function depositUserBalance(user, amount) {
  const existingUserBalance = await balanceService.searchUserBalance(user);

  let result;
  if (!existingUserBalance) {
    result = await balanceService.insertUserBalance(user, amount);
    return result;
  }

  result = await balanceService.updateUserBalance(user, amount);
  return result;
}

module.exports = { transactionValidator, transactionBuilder, depositUserBalance };
