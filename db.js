// db.js
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './users.db'; // You can change the path as needed

// Initialize and export the database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create 'users' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    hairColor TEXT,
    eyeColor TEXT,
    skinType TEXT
  )
`);

module.exports = db;
