import { AccessKey } from '../types'
import db from './init'

async function getAccessKey(key: string): Promise<AccessKey | undefined> {
  const data = await db.prepare('SELECT * FROM access_keys WHERE key = ?').get(key)
  return data as AccessKey | undefined
}

async function createAccessKey(key: string, ipAddress?: string): Promise<AccessKey> {
  const result = await db
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

export { getAccessKey, createAccessKey, assignKeyToUser, getUserKeys, removeUserKey }
