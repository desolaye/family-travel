import { EverydayPaymentType } from '../types'
import db from './init'

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

export { getLastEverydayPayment, createEverydayPayment }
