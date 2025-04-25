import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbPath = path.resolve('/app/db/database.sqlite')

const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegramId INTEGER UNIQUE,
      chatId INTEGER,
      isAdmin BOOLEAN DEFAULT FALSE,
      balance REAL DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS access_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE,
      userId INTEGER REFERENCES users(id),
      ipAddress TEXT,
      isUsed BOOLEAN DEFAULT FALSE,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER REFERENCES users(id),
      amount INTEGER,
      status TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS everyday_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT DEFAULT (datetime('now')),
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `)

export default db
