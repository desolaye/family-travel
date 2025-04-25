import { User } from '../types'
import db from './init'

function getAllUsers(): User[] {
  const users = db.prepare('SELECT * FROM users').all() as User[]
  return users || []
}

async function getUserByTelegramId(telegramId: number): Promise<User | undefined> {
  const data = await db
    .prepare('SELECT * FROM users WHERE telegramId = ?')
    .get(telegramId)

  return data as User | undefined
}

async function createUser(
  telegramId: number,
  chatId: number,
  isAdmin = false
): Promise<User> {
  const result = await db
    .prepare(
      'INSERT INTO users (telegramId, chatId, isAdmin) VALUES (?, ?, ?) RETURNING *'
    )
    .get(telegramId, chatId, isAdmin ? 1 : 0)
  return result as User
}

function updateUserBalance(userId: number, amount: number): void {
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(amount, userId)
}

export { createUser, getUserByTelegramId, updateUserBalance, getAllUsers }
