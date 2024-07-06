// Importing necessary modules and configurations
const httpError = require("http-errors"); // module to handle http errors
const { scryptSync } = require("crypto"); // module to encrypt password
const config = require("../config");  //  configuration file 

//middleware function to validate the username and password in the request body
function validateUsername(req, res, next) {
  const { username, password } = req.body;

  // checks if the username and password are of string type and if not, throws and bad request error.
  if (typeof username !== "string" || typeof password !== "string") {
    throw new httpError.BadRequest(
      "Username and Password should be string type."
    );
  }

  // calling the next middleware if the username and password are validated properly.
  next();
}

// function to build the user details with the password encrypted and returns the user details
function buildUser(username, password) {
  return {
    username: username,
    password: encryptPassword(password),
  };
}

// encrypts the password in a hexadecimal format and returns it.
function encryptPassword(password) {
  return scryptSync(password, config.PASSWORD_SALT, 64).toString("hex");
}

// exports the functions to be used by other modules.
module.exports = {
  validateUsername,
  buildUser,
  encryptPassword
};
