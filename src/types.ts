import { Context } from 'grammy'

type DateTime = string

export interface User {
  id: number
  telegramId: number
  chatId: number
  isAdmin: boolean
  balance: number
  createdAt: DateTime
}

export interface AccessKey {
  id: number
  key: string
  userId: number | null
  ipAddress: string | null
  isUsed: boolean
  createdAt: DateTime
}

export interface Payment {
  id: number
  userId: number
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: DateTime
}

export type EverydayPaymentType = {
  id: number
  day: DateTime
  createdAt: DateTime
}

export interface SessionData {
  user: User | null
}

export type BotContext = Context & {
  session: SessionData
}
