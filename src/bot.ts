import 'dotenv/config'
import { Api, Bot, GrammyError, HttpError, session } from 'grammy'

import { authMiddleware } from './middleware'

import { BotContext, SessionData } from './types'
import {
  createEverydayPayment,
  getAllUsers,
  getLastEverydayPayment,
  updateUserBalance,
} from './database'
import { envParams } from './env-params'

import { guestComposer } from './commands/guests'
import { userComposer } from './commands/user'
import { adminComposer } from './commands/admin'

function isTimeToPay(isoString1: string, isoString2: string): boolean {
  const date1 = new Date(isoString1)
  const date2 = new Date(isoString2)
  const diffInMs = Math.abs(date2.getTime() - date1.getTime())

  return diffInMs >= 60 * 1000 * 60 * 24
}

const userPay = async () => {
  const { DAILY_PAYMENT, BOT_TOKEN } = envParams()
  const api = new Api(BOT_TOKEN)

  const users = getAllUsers()

  for (const user of users) {
    if (user.isAdmin) continue

    const newBalance = user.balance - Number(DAILY_PAYMENT)
    const parsed = parseFloat(newBalance.toFixed(2))

    updateUserBalance(user.id, parsed)

    if (parsed <= Number(DAILY_PAYMENT) * 3) {
      await api.sendMessage(
        user.chatId,
        `Ваш текущий баланс ${parsed}. Время пополнить баланс`
      )
    }
  }
}

const checkEveryday = () => {
  const interval = setInterval(async () => {
    console.log('проверяем платежи...')

    const lastPayment = await getLastEverydayPayment()

    if (!lastPayment || isTimeToPay(lastPayment.day, new Date().toISOString())) {
      console.log('время оплаты')

      await createEverydayPayment(new Date().toISOString())
      await userPay()
    }
  }, 60 * 1000 * 60) // 60 * 1000ms = 1min

  return interval
}

const main = async () => {
  console.log('Запуск бота')

  const { BOT_TOKEN } = envParams()
  const bot = new Bot<BotContext>(BOT_TOKEN)

  bot.use(
    session({
      initial: (): SessionData => ({ user: null }),
    })
  )

  bot.use(authMiddleware)
  bot.use(guestComposer, userComposer, adminComposer)
  bot.start()

  bot.catch((err) => {
    const ctx = err.ctx
    console.error(`Error while handling update ${ctx.update.update_id}:`)
    const e = err.error
    if (e instanceof GrammyError) {
      console.error('Error in request:', e.description)
    } else if (e instanceof HttpError) {
      console.error('Could not contact Telegram:', e)
    } else {
      console.error('Unknown error:', e)
    }
  })

  checkEveryday()
  console.log('Бот запущен!')
}

main()
