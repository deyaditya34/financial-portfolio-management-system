// importing the necessary module and configuration.
const jwt = require("jsonwebtoken");
const config = require("../config");

// Function to create the token from the username and returning the token.
function createToken(payload) {
    const token = jwt.sign(payload, config.JWT_SECRET);

    return token;
}

// Function to decode the token, if the token is valid it returns the username else it returns null.
function decodeToken(token) {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch(err) {
        console.log("Invalid Token", token);
        return null;
    }
}

// Exporting the functions to be used in other modules.
module.exports = {
    createToken,
    decodeToken
}