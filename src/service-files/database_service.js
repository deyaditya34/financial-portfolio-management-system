const mongodb = require("mongodb");
const config = require("../config");

const mongoclient = new mongodb.MongoClient(config.MONGODB_URI);

let database = null;

async function initialize() {
    await mongoclient.connect();

    database = mongoclient.db(config.DATABASE_NAME)
}

function getCollection(collectionName) {
    return database.collection(collectionName)
}

module.exports = {
    initialize,
    getCollection
}
