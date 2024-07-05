require("dotenv").config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    PORT_NUMBER: process.env.PORT_NUMBER,
    JWT_SECRET: process.env.JWT_SECRET,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
    COLLECTION_NAME_USERS: process.env.COLLECTION_NAME_USERS,
    AUTH_TOKEN_HEADER_FIELD: process.env.AUTH_TOKEN_HEADER_FIELD
}