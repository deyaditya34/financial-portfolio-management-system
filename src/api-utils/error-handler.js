const httpError = require("http-errors");

function errorHandler(err, req, res, next) {
  console.log("[api error] :", err);

  res.send(err);

  console.log(
    { errorCode: getErrorCode(err) },
    { errorMessage: getErrorMessage(err) }
  );
}

function getErrorCode(err) {
  return err.code;
}

function getErrorMessage(err) {
  return err.message;
}

module.exports = errorHandler;