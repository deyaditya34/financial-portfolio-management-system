const httpError = require("http-errors"); // Importing the module to handle HTTP errors

// Middleware function to handle the entire errors in the application
function errorHandler(err, req, res, next) {
  console.log("[api error] :", err);

  // Send the error response to the client
  res.send(err);

  console.log(
    { errorCode: getErrorCode(err) },
    { errorMessage: getErrorMessage(err) }
  );
}

// Function to get the error code from the error object.
function getErrorCode(err) {
  return err.code;
}

// Function to get the error message from the error object
function getErrorMessage(err) {
  return err.message;
}

// Exporting the function to be used in other parts of the module
module.exports = errorHandler;