// Importing necessary modules and configurations
const httpError = require("http-errors");
const config = require("../config");
const authService = require("../auth/auth.service");

// Middleware function to verify the user token and sets the users details in the request object body.
async function userResolver(req, res, next) {
  // Extracts the token from the request.
  const token = Reflect.get(req.headers, config.AUTH_TOKEN_HEADER_FIELD);

  // If token not found, it throws and error resulting in sending error response and ending the response.
  if (!token) {
    throw new httpError.Forbidden("Access Denied");
  }

  // if token found, this function extracts the user details from the token.
  const user = await authService.getUserFromToken(token);

  // if no user found for the token, it throws an error resulting in sending error response and ending the response.
  if (!user) {
    throw new httpError.Forbidden("Invalid Token");
  }

  // sets the user details to the req body object.
  Reflect.set(req.body, "user", user);

  // calls the next middleware.
  next();
}

module.exports = userResolver;
