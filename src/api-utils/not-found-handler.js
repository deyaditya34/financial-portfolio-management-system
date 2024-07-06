const httpError = require("http-errors"); // Importing the required modules to handle HTTP errors

// Middleware function to handle requests for request path that are not found
function notFoundHandler(req, res, next) {
  // Create a 404 not found error and pass it to the next middleware in the stack
  next(httpError.NotFound("Resource not found"));
}

// Exporting the function to be used in the other parts of the module
module.exports = notFoundHandler;
