// Importing necessary modules and configurations
const httpError = require("http-errors"); // Module to handle http errors 
const config = require("../config"); // configuration file
const database = require("../service-files/database_service"); // database service module for database operations 
const jwtService = require("../service-files/jwt_service"); // jwt service module for handing JWT tokens
const authUtils = require("./auth.utils"); // utility module for authentication related operations

// Function to register a new user
async function registerUser(username, password) {
  // searches for existing username in the datbase.
  const existingUser = await database
    .getCollection(config.COLLECTION_NAME_USERS)
    .findOne({ username });

  // If username found, it throws an error with unprocessable entity. 
  if (existingUser) {
    throw new httpError.UnprocessableEntity(
      `Username '${username}' is already taken`
    );
  }

  // This function builds the userdetails to be inserted in the database. The details of this function is in the authUtils module
  const userDetails = authUtils.buildUser(username, password);  

  // Inserts the user details to the database.
  await database
    .getCollection(config.COLLECTION_NAME_USERS)
    .insertOne(userDetails);
}

//
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
