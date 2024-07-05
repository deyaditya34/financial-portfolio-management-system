const httpError = require("http-errors");
const { scryptSync } = require("crypto");
const config = require("../config");

function validateUsername(req, res, next) {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    throw new httpError.BadRequest(
      "Username and Password should be string type."
    );
  }

  next();
}

function buildUser(username, password) {
  return {
    username: username,
    password: encryptPassword(password),
  };
}

function encryptPassword(password) {
  return scryptSync(password, config.PASSWORD_SALT, 64).toString("hex");
}

module.exports = {
  validateUsername,
  buildUser,
  encryptPassword
};
