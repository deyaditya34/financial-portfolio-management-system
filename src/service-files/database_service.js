// Importing the mongo client library and configuration.
const mongodb = require("mongodb");
const config = require("../config");

// Creating an instance of mongoclient using the MONGO_URI configuration from config.
const mongoclient = new mongodb.MongoClient(config.MONGODB_URI);

// Initializing the database
let database = null;

/**
 * Initialize the MongoDB connection.
 * This function connects to the MongoDB server using MongoClient.
 * It initializes the 'database' variable with the specified database name from configuration.
 */
async function initialize() {
    // Connect to mongo server
    await mongoclient.connect();

    // Initialize the database from config.
    database = mongoclient.db(config.DATABASE_NAME)
}

// This function retrieves a mongo collection from the database by name.
function getCollection(collectionName) {
    // Returns the collection object for the collection name.
    return database.collection(collectionName)
}

// Exporting the functions to be used by other modules.
module.exports = {
    initialize,
    getCollection
}
