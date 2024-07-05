const httpError = require("http-errors");
const config = require("../config");
const database = require("../service-files/database_service");
const jwtService = require("../service-files/jwt_service");
const authUtils = require("./auth.utils");

async function registerUser(username, password) {
  const existingUser = await database
    .getCollection(config.COLLECTION_NAME_USERS)
    .findOne({ username });

  if (existingUser) {
    throw new httpError.UnprocessableEntity(
      `Username '${username}' is already taken`
    );
  }

  const userDetails = authUtils.buildUser(username, password);

  await database
    .getCollection(config.COLLECTION_NAME_USERS)
    .insertOne(userDetails);
}

async function loginUser(username, password) {
  const user = await database
    .getCollection(config.COLLECTION_NAME_USERS)
    .findOne({
      username,
      password: authUtils.encryptPassword(password),
    });

  if (!user) {
    throw new httpError.Unauthorized("Username/Password combo incorrect");
  }

  const token = jwtService.createToken({ username });

  return token;
}

async function getUserFromToken(token) {
  const payload = jwtService.decodeToken(token);

  if (!payload) {
    return null;
  }
  
  const username = payload.username;
  
  const user = await database
    .getCollection(config.COLLECTION_NAME_USERS)
    .findOne({ username }, { projection: { _id: false, password: false } });
 
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  getUserFromToken,
};
