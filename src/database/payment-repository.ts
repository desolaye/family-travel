import { Payment } from '../types'
import db from './init'

async function createPayment(userId: number, amount: number): Promise<Payment> {
  const result = await db
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

export { createPayment, updatePaymentStatus, getPaymentById, getPendingPayments }
