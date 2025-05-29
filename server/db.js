const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'arcade_verse';

let client;
let db;

async function connect() {
  try {
    client = await MongoClient.connect(uri);
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return db;
}

async function close() {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

module.exports = {
  connect,
  getDb,
  close
}; 