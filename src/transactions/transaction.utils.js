// Importing the balance service module
const balanceService = require("../balance/balance.service");

// Function to validate all the req transaction params
function transactionValidator(transactionDetails) {
  // Arrays and string to collect the invalid params
  let invalidStringTypeParams = [];
  let invalidTransactionType = "";
  let invalidNumberTypeParams = [];
  let invalidDateTypeParams = [];

  // Check if amount is a number
  if (typeof transactionDetails.amount !== "number") {
    invalidNumberTypeParams.push(transactionDetails.amount);
  }

  // Check if price is present and whether it is a number
  if (Reflect.has(transactionDetails, "price")) {
    if (typeof transactionDetails.price !== "number") {
      invalidNumberTypeParams.push(transactionDetails.price);
    }
  }

  // Check if date is a string and is valid
  if (typeof transactionDetails.date !== "string") {
    invalidDateTypeParams.push(transactionDetails.date);
  } else if (isNaN(new Date(transactionDetails.date))) {
    invalidDateTypeParams.push(transactionDetails.date);
  }

  // Check if asset is present and whether it is a string
  if (Reflect.has(transactionDetails, "asset")) {
    if (typeof transactionDetails.asset !== "string") {
      invalidStringTypeParams.push(transactionDetails.asset);
    }
  }

  // Check if type is a string and the one of the required values
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

  // Prepare the result string with invalid parameters.
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

  // Return the result if invalid params are found, else return null
  if (result.length > 17) {
    return result;
  }

  return null;
}

// Function to build the transction object from req transaction params 
function transactionBuilder(transactionDetails) {
  const result = {};

  // Handle deposit and withdrawal transactions
  if (
    transactionDetails.type === "deposit" ||
    transactionDetails.type === "withdrawal"
  ) {
    Reflect.set(result, "amount", Number(transactionDetails.amount));
    Reflect.set(result, "date", new Date(transactionDetails.date));
    Reflect.set(result, "type", transactionDetails.type);
    Reflect.set(result, "user", transactionDetails.user.username);
  } else {
    // Handle buy and sell transactions
    Reflect.set(result, "type", transactionDetails.type);
    Reflect.set(result, "asset", transactionDetails.asset);
    Reflect.set(result, "amount", Number(transactionDetails.amount));
    Reflect.set(result, "price", Number(transactionDetails.price));
    Reflect.set(result, "date", new Date(transactionDetails.date));
    Reflect.set(result, "user", transactionDetails.user.username);
  }
  // Return the transaction object
  return result;
}

// Function to update the balance with every buy or sell transaction.
async function updateUserBalance(user, amount) {
  // Fetch the balance of the user
  const existingUserBalance = await balanceService.searchUserBalance(user);

  let result;
  // If no previous balance found of the user, the new balance is inserted.
  if (!existingUserBalance) {
    result = await balanceService.insertUserBalance(user, amount);
    return result;
  }
  
  // Else, the balance is adjusted against the previous balance with the new amount.
  result = await balanceService.updateUserBalance(user, amount);
  return result;
}

// Exporting the functions to be used in other modules.
module.exports = { transactionValidator, transactionBuilder, updateUserBalance };
