const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'donasi-yuk';

let database = null

async function connect() {
    await client.connect();
    const db = client.db(dbName);

    database = db
}

function getDatabase() {
    return database
}

module.exports = {
    connect,
    getDatabase
}