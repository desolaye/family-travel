import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

import { User, AccessKey, Payment, EverydayPaymentType } from './types'

const dbPath = path.resolve('/app/db/database.sqlite')

const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)

function initializeDatabase() {
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
}

async function getUserByTelegramId(telegramId: number): Promise<User | undefined> {
  const data = await db
    .prepare('SELECT * FROM users WHERE telegramId = ?')
    .get(telegramId)

  return data as User | undefined
}

function createUser(telegramId: number, chatId: number, isAdmin = false): User {
  const result = db
    .prepare(
      'INSERT INTO users (telegramId, chatId, isAdmin) VALUES (?, ?, ?) RETURNING *'
    )
    .get(telegramId, chatId, isAdmin ? 1 : 0)
  return result as User
}

function updateUserBalance(userId: number, amount: number): void {
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(amount, userId)
}

function getAccessKey(key: string): AccessKey | undefined {
  const data = db.prepare('SELECT * FROM access_keys WHERE key = ?').get(key)
  return data as AccessKey | undefined
}

function createAccessKey(key: string, ipAddress?: string): AccessKey {
  const result = db
    .prepare('INSERT INTO access_keys (key, ipAddress) VALUES (?, ?) RETURNING *')
    .get(key, ipAddress ?? null)
  return result as AccessKey
}

function assignKeyToUser(key: string, userId: number): void {
  db.prepare('UPDATE access_keys SET userId = ?, isUsed = TRUE WHERE key = ?').run(
    userId,
    key
  )
}

function getUserKeys(userId: number): AccessKey[] {
  return db
    .prepare('SELECT * FROM access_keys WHERE userId = ?')
    .all(userId) as AccessKey[]
}

function removeUserKey(userId: number, key: string): boolean {
  const result = db
    .prepare('UPDATE access_keys SET userId = NULL WHERE key = ? AND userId = ?')
    .run(key, userId)
  return result.changes > 0
}

function createPayment(userId: number, amount: number): Payment {
  const result = db
    .prepare('INSERT INTO payments (userId, amount) VALUES (?, ?) RETURNING *')
    .get(userId, amount)
  return result as Payment
}

function updatePaymentStatus(paymentId: number, status: 'approved' | 'rejected'): void {
  db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, paymentId)
}

async function getPaymentById(paymentId: number): Promise<Payment | null> {
  const payment = (await db
    .prepare('SELECT * FROM payments WHERE id = ?')
    .get(paymentId)) as Payment

  return payment ?? null
}

function getPendingPayments(): Payment[] {
  return db.prepare('SELECT * FROM payments WHERE status = "pending"').all() as Payment[]
}

function getAllUsers(): User[] {
  const users = db.prepare('SELECT * FROM users').all() as User[]
  return users || []
}

async function getLastEverydayPayment(): Promise<EverydayPaymentType | null> {
  const payment = db
    .prepare('SELECT * FROM everyday_payments ORDER BY id DESC LIMIT 1')
    .all() as EverydayPaymentType[]

  return payment[0] || null
}

async function createEverydayPayment(day: string): Promise<EverydayPaymentType | null> {
  const result = (await db
    .prepare('INSERT INTO everyday_payments (day) VALUES (?) RETURNING *')
    .get(day)) as EverydayPaymentType

  return result || null
}

initializeDatabase()

export {
  getUserByTelegramId,
  createEverydayPayment,
  getLastEverydayPayment,
  getPaymentById,
  createUser,
  updateUserBalance,
  getAccessKey,
  createAccessKey,
  assignKeyToUser,
  getUserKeys,
  removeUserKey,
  createPayment,
  updatePaymentStatus,
  getPendingPayments,
  getAllUsers,
}
